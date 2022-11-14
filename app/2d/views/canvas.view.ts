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
    program: WebGLProgram;
    attribLocations: {
      vertexPosition: number;
    };
    uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null;
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
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(
            shaderProgram,
            "u_resolution"
          ),
        },
        buffer: buffer,
      };

      objects.push(programInfo);
    });

    if (!objects) return;

    this.drawScene(objects);
  }
  //Array<{ position: WebGLBuffer | null }>
  drawScene(
    objects: Array<{
      program: WebGLProgram;
      attribLocations: {
        vertexPosition: number;
      };
      uniformLocations: {
        projectionMatrix: WebGLUniformLocation | null;
      };
      buffer: { position: WebGLBuffer } | undefined;
    }>
  ) {
    if (!this.gl) return;
    let { gl } = this;
    let matrix = [0, 0];

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // gl.useProgram(this.programInfo.program);
    //
    // gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);

    // var size = 2; // 2 components per iteration
    // var type = gl.FLOAT; // the data is 32bit floats
    // var normalize = false; // don't normalize the data
    // var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    // var offset = 0; // start at the beginning of the buffer
    // gl.bindBuffer(gl.ARRAY_BUFFER, buffer.position);
    // gl.vertexAttribPointer(
    //   this.programInfo.attribLocations.vertexPosition,
    //   size,
    //   type,
    //   normalize,
    //   stride,
    //   offset
    // );
    //
    // // set the resolution
    // gl.uniform2f(
    //   this.programInfo.uniformLocations.projectionMatrix,
    //   gl.canvas.width,
    //   gl.canvas.height
    // );
    //
    // // Draw the rectangle.
    // var primitiveType = gl.TRIANGLES;
    // var offset = 0;
    // var count = 6;
    // gl.drawArrays(primitiveType, offset, count);

    objects.forEach(function (object) {
      if (!object || !object.buffer || !object.buffer.position) return;

      var size = 2; // 2 components per iteration
      var type = gl.FLOAT; // the data is 32bit floats
      var normalize = false; // don't normalize the data
      var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
      var offset = 0; // start at the beginning of the buffer

      var programInfo = object.program;
      var bufferInfo = object.buffer;

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
        object.uniformLocations.projectionMatrix,
        gl.canvas.width,
        gl.canvas.height
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

  initBuffers(gl: WebGLRenderingContext, pipe: Pipe) {
    const positionBuffer = gl.createBuffer();

    if (!positionBuffer) return;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    let x = pipe.from.vec.x;
    let y = pipe.from.vec.y;
    let width = pipe.width;
    let height = pipe.width;
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;

    const positions = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
    };
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
