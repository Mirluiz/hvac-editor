"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_model_1 = __importDefault(require("../models/heating/pipe.model"));
var shader_1 = require("../../shaders/shader");
var m3_1 = require("../../math/m3");
var fitting_model_1 = __importDefault(require("../models/heating/fitting.model"));
var vect_1 = require("../../geometry/vect");
var Canvas = /** @class */ (function () {
    function Canvas(model) {
        this.gl = null;
        this.objects = [];
        this.model = model;
        this.container = document.querySelector("#editor");
        // this.init();
    }
    Canvas.prototype.init = function () {
        if (!this.container)
            return;
        this.initCanvasContainer();
        this.gl = this.container.getContext("webgl");
        if (this.gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.objects = [];
        var gl = this.gl;
        var shaderProgram = this.initShaderProgram(gl, (0, shader_1.vertex)(), (0, shader_1.fragment)());
        if (!shaderProgram)
            return;
        var buffer = this.initBuffers();
        var programInfo = {
            objectID: "asd",
            program: shaderProgram,
            attribLocations: {
                vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
                vertexColor: gl.getAttribLocation(shaderProgram, "a_color"),
            },
            uniformLocations: {
                resolutionLocation: gl.getUniformLocation(shaderProgram, "u_resolution"),
                matrixLocation: gl.getUniformLocation(shaderProgram, "u_matrix"),
            },
            buffer: buffer,
        };
        this.objects.push(programInfo);
        if (!this.objects)
            return;
        this.drawScene();
    };
    Canvas.prototype.update = function () {
        var _this = this;
        if (!this.gl)
            return;
        var _a = this, initShaderProgram = _a.initShaderProgram, gl = _a.gl, initBuffers = _a.initBuffers;
        this.model.pipes.map(function (pipe) {
            var newPipe = _this.objects.find(function (p) {
                return p.objectID !== pipe.id;
            });
            if (newPipe) {
                var shaderProgram = initShaderProgram.bind(_this)(gl, (0, shader_1.vertex)(), (0, shader_1.fragment)());
                if (!shaderProgram)
                    return;
                var buffer = initBuffers.bind(_this)();
                var programInfo = {
                    objectID: pipe.id,
                    program: shaderProgram,
                    attribLocations: {
                        vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
                        vertexColor: gl.getAttribLocation(shaderProgram, "a_color"),
                    },
                    uniformLocations: {
                        resolutionLocation: gl.getUniformLocation(shaderProgram, "u_resolution"),
                        matrixLocation: gl.getUniformLocation(shaderProgram, "u_matrix"),
                    },
                    buffer: buffer,
                };
                _this.objects.push(programInfo);
            }
        });
    };
    Canvas.prototype.drawScene = function () {
        if (!this.gl)
            return;
        var gl = this.gl;
        var objects = this.objects;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var model = this.model;
        objects.forEach(function (object) {
            if (!object || !object.buffer || !object.buffer.position)
                return;
            var program = object.program;
            gl.useProgram(program);
            // Setup all the needed attributes.
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.position);
                gl.vertexAttribPointer(object.attribLocations.vertexPosition, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(object.attribLocations.vertexPosition);
            }
            {
                gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.color);
                gl.vertexAttribPointer(object.attribLocations.vertexColor, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(object.attribLocations.vertexColor);
            }
            gl.uniform2f(object.uniformLocations.resolutionLocation, gl.canvas.width, gl.canvas.height);
            var translationMatrix = m3_1.m3.translation(model.offset.x, model.offset.y);
            var rotationMatrix = m3_1.m3.rotation(0);
            var scaleMatrix = m3_1.m3.scaling(model.scale.amount, model.scale.amount);
            // Multiply the matrices.
            var matrix = m3_1.m3.multiply(translationMatrix, rotationMatrix);
            matrix = m3_1.m3.multiply(matrix, scaleMatrix);
            // Set the matrix.
            gl.uniformMatrix3fv(object.uniformLocations.matrixLocation, false, matrix);
            // Draw
            // console.log(" object.buffer.count", object.buffer.count);
            gl.drawArrays(gl.TRIANGLES, 0, object.buffer.count / 2);
        });
    };
    Canvas.prototype.initBuffers = function () {
        var _this = this;
        var vertices = [];
        var colors = [];
        __spreadArray(__spreadArray([], this.model.pipes, true), this.model.fittings, true).map(function (object) {
            if (object instanceof pipe_model_1.default) {
                vertices = vertices.concat(_this.createRect(object).vertices);
                colors = colors.concat(_this.createRect(object).colors);
            }
            if (object instanceof fitting_model_1.default) {
                vertices = vertices.concat(_this.createCircle(object).vertices);
                colors = colors.concat(_this.createCircle(object).colors);
            }
        });
        var positionBuffer = this.createBuffer(new Float32Array(vertices));
        var colorBuffer = this.createBuffer(new Float32Array(colors));
        if (!positionBuffer || !colorBuffer)
            return;
        return {
            position: positionBuffer,
            color: colorBuffer,
            count: vertices.length,
        };
    };
    Canvas.prototype.createBuffer = function (data) {
        var buffer;
        var gl = this.gl;
        if (!gl)
            return;
        buffer = gl.createBuffer();
        if (!buffer) {
            console.error("buffer error");
            return null;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
        return buffer;
    };
    Canvas.prototype.createRect = function (pipe) {
        var leftTop = pipe.from.vec
            .sub(pipe.from.getOpposite().vec)
            .normalize()
            .perpendicular("left")
            .multiply(pipe.width)
            .sum(pipe.from.getOpposite().vec);
        var rightTop = pipe.from.vec
            .sub(pipe.from.getOpposite().vec)
            .normalize()
            .perpendicular("right")
            .multiply(pipe.width)
            .sum(pipe.from.getOpposite().vec);
        var leftBottom = pipe.to.vec
            .sub(pipe.to.getOpposite().vec)
            .normalize()
            .perpendicular("left")
            .multiply(pipe.width)
            .sum(pipe.to.getOpposite().vec);
        var rightBottom = pipe.to.vec
            .sub(pipe.to.getOpposite().vec)
            .normalize()
            .perpendicular("right")
            .multiply(pipe.width)
            .sum(pipe.to.getOpposite().vec);
        var color = [];
        new Array(6).fill(0).map(function () {
            color.push.apply(color, pipe.color);
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
    };
    Canvas.prototype.createCircle = function (fitting) {
        var ret = [];
        var pieces = 12;
        var i = 0;
        var a = 360 / pieces;
        while (i < pieces) {
            var angle1 = (i * a * Math.PI) / 180;
            var angle2 = ((i * a + a) * Math.PI) / 180;
            var A = new vect_1.Vector(0, 0);
            var B = A.sub(new vect_1.Vector(Math.cos(angle1), Math.sin(angle1))).multiply(fitting.width);
            var C = A.sub(new vect_1.Vector(Math.cos(angle2), Math.sin(angle2))).multiply(fitting.width);
            A = A.sum(fitting.center);
            B = B.sum(fitting.center);
            C = C.sum(fitting.center);
            ret.push(A.x, A.y, B.x, B.y, C.x, C.y);
            i++;
        }
        return {
            vertices: ret,
            colors: new Array(pieces * 9).fill(0),
        };
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
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
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
