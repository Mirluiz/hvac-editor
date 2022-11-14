"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_1 = require("../../shaders/shader");
var Canvas = /** @class */ (function () {
    function Canvas(model) {
        this.pipe = null;
        this.valve = null;
        this.fitting = null;
        this.radiator = null;
        this.gl = null;
        this.model = model;
        this.container = document.querySelector("#editor");
        // this.init();
    }
    Canvas.prototype.init = function () {
        var _this = this;
        if (!this.container)
            return;
        this.initCanvasContainer();
        this.gl = this.container.getContext("webgl");
        if (this.gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        var objects = [];
        var gl = this.gl;
        this.model.pipes.map(function (pipe) {
            var shaderProgram = _this.initShaderProgram(gl, (0, shader_1.vertex)(), (0, shader_1.fragment)());
            if (!shaderProgram)
                return;
            var buffer = _this.initBuffers(gl, pipe);
            var programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
                },
                uniformLocations: {
                    projectionMatrix: gl.getUniformLocation(shaderProgram, "u_resolution"),
                },
                buffer: buffer,
            };
            objects.push(programInfo);
        });
        if (!objects)
            return;
        this.drawScene(objects);
    };
    //Array<{ position: WebGLBuffer | null }>
    Canvas.prototype.drawScene = function (objects) {
        if (!this.gl)
            return;
        var gl = this.gl;
        var matrix = [0, 0];
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.useProgram(this.programInfo.program);
        gl.enableVertexAttribArray(this.programInfo.attribLocations.vertexPosition);
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
            if (!object || !object.buffer || !object.buffer.position)
                return;
            var size = 2; // 2 components per iteration
            var type = gl.FLOAT; // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0; // start at the beginning of the buffer
            var programInfo = object.program;
            var bufferInfo = object.buffer;
            gl.useProgram(programInfo);
            // Setup all the needed attributes.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.position);
            gl.vertexAttribPointer(object.attribLocations.vertexPosition, size, type, normalize, stride, offset);
            gl.uniform2f(object.uniformLocations.projectionMatrix, gl.canvas.width, gl.canvas.height);
            // Draw
            gl.drawArrays(gl.TRIANGLES, 0, 12);
        });
    };
    Canvas.prototype.initShaderProgram = function (gl, vsSource, fsSource) {
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader)
            return;
        var shaderProgram = gl.createProgram();
        if (!shaderProgram)
            return;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: ".concat(gl.getProgramInfoLog(shaderProgram)));
            return null;
        }
        return shaderProgram;
    };
    Canvas.prototype.loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);
        if (!shader)
            return;
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        // Compile the shader program
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    Canvas.prototype.initBuffers = function (gl, pipe) {
        var positionBuffer = gl.createBuffer();
        if (!positionBuffer)
            return;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var x = pipe.from.vec.x;
        var y = pipe.from.vec.y;
        var width = pipe.width;
        var height = pipe.width;
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        var positions = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        return {
            position: positionBuffer,
        };
    };
    Canvas.prototype.initCanvasContainer = function () {
        if (!this.container)
            return;
        var h = Math.ceil(screen.height / this.model.config.net.step) *
            this.model.config.net.step;
        var w = Math.ceil(screen.width / this.model.config.net.step) *
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
    };
    return Canvas;
}());
exports.default = Canvas;
