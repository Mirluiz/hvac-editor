"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var shader_1 = require("../../shaders/shader");
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
            // console.log("model.offset", model.offset);
            // let translationMatrix = m3.translation(model.offset.x, model.offset.y);
            // let rotationMatrix = m3.rotation(0);
            // let scaleMatrix = m3.scaling(model.scale.amount, model.scale.amount);
            // let matrix = m3.multiply(translationMatrix, rotationMatrix);
            // matrix = m3.multiply(matrix, scaleMatrix);
            // Set the matrix.
            gl.uniformMatrix3fv(object.uniformLocations.matrixLocation, false, matrix);
            // Draw
            // console.log(" object.buffer.count", object.buffer.count);
            gl.drawArrays(gl.TRIANGLES, 0, object.buffer.count / 2);
        });
    };
    Canvas.prototype.initBuffers = function () {
        var _this = this;
        var _a, _b, _c, _d, _e, _f;
        var vertices = [];
        var colors = [];
        // [...this.model.pipes, ...this.model.fittings].map((object) => {
        //   if (object instanceof Pipe) {
        //     vertices = vertices.concat(this.createRect(object).vertices);
        //     colors = colors.concat(this.createRect(object).colors);
        //   }
        //   if (object instanceof Fitting) {
        //     vertices = vertices.concat(this.createCircle(object).vertices);
        //     colors = colors.concat(this.createCircle(object).colors);
        //   }
        // });
        [
            new vect_1.Vector(10, 10),
            new vect_1.Vector(100, 100),
            new vect_1.Vector(150, 150),
            new vect_1.Vector(250, 150),
            new vect_1.Vector(((_c = (_b = (_a = this.model) === null || _a === void 0 ? void 0 : _a.canvasSize) === null || _b === void 0 ? void 0 : _b.x) !== null && _c !== void 0 ? _c : 0) / 2, ((_f = (_e = (_d = this.model) === null || _d === void 0 ? void 0 : _d.canvasSize) === null || _e === void 0 ? void 0 : _e.y) !== null && _f !== void 0 ? _f : 0) / 2),
        ].map(function (object) {
            vertices = vertices.concat(_this.createExampleCircle(object).vertices);
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
        var color = [];
        new Array(pieces * 9).fill(0).map(function () {
            color.push.apply(color, fitting.color);
        });
        return {
            vertices: ret,
            colors: color,
        };
    };
    Canvas.prototype.createExampleCircle = function (center) {
        var ret = [];
        var pieces = 12;
        var i = 0;
        var a = 360 / pieces;
        while (i < pieces) {
            var angle1 = (i * a * Math.PI) / 180;
            var angle2 = ((i * a + a) * Math.PI) / 180;
            var A = new vect_1.Vector(0, 0);
            var B = A.sub(new vect_1.Vector(Math.cos(angle1), Math.sin(angle1))).multiply(5);
            var C = A.sub(new vect_1.Vector(Math.cos(angle2), Math.sin(angle2))).multiply(5);
            A = A.sum(center);
            B = B.sum(center);
            C = C.sum(center);
            ret.push(A.x, A.y, B.x, B.y, C.x, C.y);
            i++;
        }
        return {
            vertices: ret,
            colors: [],
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
