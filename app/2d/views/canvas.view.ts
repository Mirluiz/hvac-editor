import CanvasModel from "../models/canvas.model";
import Pipe from "../models/heating/pipe.model";
import { fragment, vertex } from "../../shaders/shader";
import { m3 } from "../../math/m3";
import Fitting from "../models/heating/fitting.model";
import { Vector } from "../../geometry/vect";

class Canvas {
  model: CanvasModel;
  container: HTMLCanvasElement | null;
  gl: WebGLRenderingContext | null = null;
  programInfo: any;
  objects: Array<{
    objectID: string;
    program: WebGLProgram;
    attribLocations: {
      vertexPosition: number;
      vertexColor: number;
    };
    uniformLocations: {
      resolutionLocation: WebGLUniformLocation | null;
      matrixLocation: WebGLUniformLocation | null;
    };
    buffer:
      | { position: WebGLBuffer; count: number; color: WebGLBuffer }
      | undefined;
  }> = [];

  constructor(model: CanvasModel) {
    this.model = model;
    this.container = document.querySelector("#editor");

    // this.init();
  }

  init() {
    if (!this.container) return;
    this.initCanvasContainer();

    this.gl = this.container.getContext("webgl");

    if (this.gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it."
      );
      return;
    }

    this.objects = [];

    let { gl } = this;

    let shaderProgram = this.initShaderProgram(gl, vertex(), fragment());

    if (!shaderProgram) return;

    let buffer = this.initBuffers();

    let programInfo = {
      objectID: "asd",
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
        vertexColor: gl.getAttribLocation(shaderProgram, "a_color"),
      },
      uniformLocations: {
        resolutionLocation: gl.getUniformLocation(
          shaderProgram,
          "u_resolution"
        ),
        matrixLocation: gl.getUniformLocation(shaderProgram, "u_matrix"),
      },
      buffer: buffer,
    };

    this.objects.push(programInfo);

    if (!this.objects) return;

    this.drawScene();
  }

  update() {
    if (!this.gl) return;

    let { initShaderProgram, gl, initBuffers } = this;

    this.model.pipes.map((pipe) => {
      let newPipe = this.objects.find((p) => {
        return p.objectID !== pipe.id;
      });

      if (newPipe) {
        let shaderProgram = initShaderProgram.bind(this)(
          gl,
          vertex(),
          fragment()
        );

        if (!shaderProgram) return;

        let buffer = initBuffers.bind(this)();

        let programInfo = {
          objectID: pipe.id,
          program: shaderProgram,
          attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
            vertexColor: gl.getAttribLocation(shaderProgram, "a_color"),
          },
          uniformLocations: {
            resolutionLocation: gl.getUniformLocation(
              shaderProgram,
              "u_resolution"
            ),
            matrixLocation: gl.getUniformLocation(shaderProgram, "u_matrix"),
          },
          buffer: buffer,
        };

        this.objects.push(programInfo);
      }
    });
  }

  drawScene() {
    if (!this.gl) return;
    let { gl } = this;
    const { objects } = this;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    let { model } = this;

    objects.forEach(function (object) {
      if (!object || !object.buffer || !object.buffer.position) return;

      const { program } = object;

      gl.useProgram(program);

      // Setup all the needed attributes.
      {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.position);
        gl.vertexAttribPointer(
          object.attribLocations.vertexPosition,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.enableVertexAttribArray(object.attribLocations.vertexPosition);
      }

      {
        gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.color);
        gl.vertexAttribPointer(
          object.attribLocations.vertexColor,
          3,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.enableVertexAttribArray(object.attribLocations.vertexColor);
      }

      gl.uniform2f(
        object.uniformLocations.resolutionLocation,
        gl.canvas.width,
        gl.canvas.height
      );

      let translationMatrix = m3.translation(model.offset.x, model.offset.y);
      let rotationMatrix = m3.rotation(0);
      let scaleMatrix = m3.scaling(model.scale.amount, model.scale.amount);

      // Multiply the matrices.
      let matrix = m3.multiply(translationMatrix, rotationMatrix);
      matrix = m3.multiply(matrix, scaleMatrix);

      // Set the matrix.
      gl.uniformMatrix3fv(
        object.uniformLocations.matrixLocation,
        false,
        matrix
      );
      // Draw
      // console.log(" object.buffer.count", object.buffer.count);
      gl.drawArrays(gl.TRIANGLES, 0, object.buffer.count / 2);
    });
  }

  initBuffers() {
    let vertices: Array<number> = [];
    let colors: Array<number> = [];

    [...this.model.pipes, ...this.model.fittings].map((object) => {
      if (object instanceof Pipe) {
        vertices = vertices.concat(this.createRect(object).vertices);
        colors = colors.concat(this.createRect(object).colors);
      }
      if (object instanceof Fitting) {
        vertices = vertices.concat(this.createCircle(object).vertices);
        colors = colors.concat(this.createCircle(object).colors);
      }
    });

    let positionBuffer = this.createBuffer(new Float32Array(vertices));
    let colorBuffer = this.createBuffer(new Float32Array(colors));

    if (!positionBuffer || !colorBuffer) return;

    return {
      position: positionBuffer,
      color: colorBuffer,
      count: vertices.length,
    };
  }

  createBuffer(data: Float32Array) {
    let buffer;
    let { gl } = this;

    if (!gl) return;

    buffer = gl.createBuffer();

    if (!buffer) {
      console.error("buffer error");
      return null;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    return buffer;
  }

  createRect(pipe: Pipe) {
    let leftTop = pipe.from.vec
      .sub(pipe.from.getOpposite().vec)
      .normalize()
      .perpendicular("left")
      .multiply(pipe.width)
      .sum(pipe.from.getOpposite().vec);
    let rightTop = pipe.from.vec
      .sub(pipe.from.getOpposite().vec)
      .normalize()
      .perpendicular("right")
      .multiply(pipe.width)
      .sum(pipe.from.getOpposite().vec);
    let leftBottom = pipe.to.vec
      .sub(pipe.to.getOpposite().vec)
      .normalize()
      .perpendicular("left")
      .multiply(pipe.width)
      .sum(pipe.to.getOpposite().vec);
    let rightBottom = pipe.to.vec
      .sub(pipe.to.getOpposite().vec)
      .normalize()
      .perpendicular("right")
      .multiply(pipe.width)
      .sum(pipe.to.getOpposite().vec);

    let color: Array<number> = [];
    new Array(6).fill(0).map(() => {
      color.push(...pipe.color);
    });

    return {
      vertices: [
        leftTop.x,
        leftTop.y,
        rightBottom.x,
        rightBottom.y,
        rightTop.x,
        rightTop.y,

        rightBottom.x,
        rightBottom.y,
        rightTop.x,
        rightTop.y,
        leftBottom.x,
        leftBottom.y,
      ],
      colors: color,
    };
  }

  createCircle(fitting: Fitting) {
    let ret: Array<number> = [];

    const pieces = 12;
    let i = 0;
    let a = 360 / pieces;

    while (i < pieces) {
      let angle1 = (i * a * Math.PI) / 180;
      let angle2 = ((i * a + a) * Math.PI) / 180;
      let A = new Vector(0, 0);
      let B = A.sub(new Vector(Math.cos(angle1), Math.sin(angle1))).multiply(
        fitting.width
      );
      let C = A.sub(new Vector(Math.cos(angle2), Math.sin(angle2))).multiply(
        fitting.width
      );

      A = A.sum(fitting.center);
      B = B.sum(fitting.center);
      C = C.sum(fitting.center);

      ret.push(A.x, A.y, B.x, B.y, C.x, C.y);
      i++;
    }

    let color: Array<number> = [];
    new Array(pieces * 9).fill(0).map(() => {
      color.push(...fitting.color);
    });

    return {
      vertices: ret,
      colors: color,
    };
  }

  initShaderProgram(
    gl: WebGLRenderingContext,
    vsSource: string,
    fsSource: string
  ) {
    const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    if (!vertexShader || !fragmentShader) return;

    const shaderProgram = gl.createProgram();

    if (!shaderProgram) return;

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert(
        `Unable to initialize the shader program: ${gl.getProgramInfoLog(
          shaderProgram
        )}`
      );
      return null;
    }

    return shaderProgram;
  }

  loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);

    if (!shader) return;

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(
        `An error occurred compiling the shaders: ${gl.getShaderInfoLog(
          shader
        )}`
      );
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  initCanvasContainer(): void {
    if (!this.container) return;

    let h =
      Math.ceil(screen.height / this.model.config.net.step) *
      this.model.config.net.step;
    let w =
      Math.ceil(screen.width / this.model.config.net.step) *
        this.model.config.net.step -
      250; // 250 is panel width

    this.container.style.height = h + "px";
    this.container.style.width = w + "px";
    this.container.height = h;
    this.container.width = w;

    this.model.canvasSize = {
      y: h,
      x: w,
    };
  }
}

export default Canvas;
