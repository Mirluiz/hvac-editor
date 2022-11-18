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
    buffer: { position: WebGLBuffer; count: number } | undefined;
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

    let buffer = this.initBuffers(gl, [
      ...this.model.pipes,
      ...this.model.fittings,
    ]);

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

        let buffer = initBuffers.bind(this)(gl, []);

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

      var size = 2; // 2 components per iteration
      var type = gl.FLOAT; // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0; // start at the beginning of the buffer

      var programInfo = object.program;

      gl.useProgram(programInfo);
      gl.enableVertexAttribArray(object.attribLocations.vertexPosition);

      // gl.bindBuffer(gl.ARRAY_BUFFER, object.attribLocations.vertexColor);
      // set the color
      // gl.uniform4fv(object.attribLocations.vertexColor, color);

      // {
      //   var color = [Math.random(), Math.random(), Math.random(), 1];
      //   // set the color
      //   gl.uniform4fv(gl.getUniformLocation(object.program, "u_color"), color);
      // }

      // Setup all the needed attributes.
      gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.position);
      gl.vertexAttribPointer(
        object.attribLocations.vertexPosition,
        size,
        type,
        normalize,
        stride,
        offset
      );

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
      // matrix = m3.multiply(matrix, scaleMatrix);

      // Set the matrix.
      gl.uniformMatrix3fv(
        object.uniformLocations.matrixLocation,
        false,
        matrix
      );
      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, object.buffer.count);
    });
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

  initBuffers(gl: WebGLRenderingContext, objects: Array<Pipe | Fitting>) {
    const positionBuffer = gl.createBuffer();
    // const colorBuffer = gl.createBuffer();
    if (!positionBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let positions: Array<number> = [];
    let colors: Array<number> = [];

    objects.map((object) => {
      if (object instanceof Pipe) {
        positions = positions.concat(this.createRect(object));
        // colors = [
        //   0.0,
        //   0.0,
        //   0.0,
        //   0.0, // white
        //   1.0,
        //   1.0,
        //   1.0,
        //   1.0, // red
        //   0.0,
        //   0.0,
        //   0.0,
        //   0.0, // green
        //   0.0,
        //   0.0,
        //   0.0,
        //   0.0, // blue
        // ];
      }

      // if (object instanceof Fitting) {
      //   positions = positions.concat(this.createCircle(object));
      //   colors = [
      //     0,
      //     0,
      //     0,
      //     0, // white
      //     0,
      //     0,
      //     0,
      //     0, // red
      //     0,
      //     0,
      //     0,
      //     0, // green
      //     0,
      //     0,
      //     0,
      //     0, // blue
      //   ];
      // }
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      count: positions.length,
    };
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

    return [
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
    ];
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

    console.log("ret", ret);

    return ret;
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
