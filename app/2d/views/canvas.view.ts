import { IVec, Vector } from "../../geometry/vect";
import CanvasModel from "../models/canvas.model";
import PipeView from "./pipe.view";
import ValveView from "./valve.view";
import FittingView from "./fitting.view";
import RadiatorView from "./radiator.view";
import Pipe from "../models/heating/pipe.model";
import PipeGhost from "../models/ghost/heating/pipe.model";
import Wall from "../models/architecture/wall.model";
import Radiator from "../models/heating/radiator.model";
import Valve from "../models/heating/valve.model";
import ValveGhostModel from "../models/ghost/heating/valve.model";
import Fitting from "../models/heating/fitting.model";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import RadiatorModel from "../models/ghost/heating/radiator.model";
import { fragment, vertex } from "../../shaders/shader";
import { m3 } from "../../math/m3";

class Canvas {
  model: CanvasModel;
  container: HTMLCanvasElement | null;
  pipe: PipeView | null = null;
  valve: ValveView | null = null;
  fitting: FittingView | null = null;
  radiator: RadiatorView | null = null;
  gl: WebGLRenderingContext | null = null;
  programInfo: any;
  objects: Array<{
    objectID: string;
    program: WebGLProgram;
    attribLocations: {
      vertexPosition: number;
    };
    uniformLocations: {
      resolutionLocation: WebGLUniformLocation | null;
      matrixLocation: WebGLUniformLocation | null;
    };
    buffer: { position: WebGLBuffer } | undefined;
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

    this.model.pipes.map((pipe) => {
      let shaderProgram = this.initShaderProgram(gl, vertex(), fragment());

      if (!shaderProgram) return;

      let buffer = this.initBuffers(gl, pipe);

      let programInfo = {
        objectID: pipe.id,
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
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
    });

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

      console.log("newPipe", newPipe);

      if (newPipe) {
        let shaderProgram = initShaderProgram.bind(this)(
          gl,
          vertex(),
          fragment()
        );

        if (!shaderProgram) return;

        let buffer = initBuffers.bind(this)(gl, pipe);

        let programInfo = {
          objectID: pipe.id,
          program: shaderProgram,
          attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
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
      gl.drawArrays(gl.TRIANGLES, 0, 6);
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

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

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

  initBuffers(gl: WebGLRenderingContext, object: Pipe | Fitting) {
    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    let positions: Array<number> = [];

    if (object instanceof Pipe)
      positions =
        this.createRect(
          object
        ); /*[x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];*/

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
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
