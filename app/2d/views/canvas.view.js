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
var vect_1 = require("../../geometry/vect");
var pipe_view_1 = __importDefault(require("./pipe.view"));
var valve_view_1 = __importDefault(require("./valve.view"));
var fitting_view_1 = __importDefault(require("./fitting.view"));
var radiator_view_1 = __importDefault(require("./radiator.view"));
var pipe_model_1 = __importDefault(require("../models/heating/pipe.model"));
var wall_model_1 = __importDefault(require("../models/architecture/wall.model"));
var radiator_model_1 = __importDefault(require("../models/heating/radiator.model"));
var valve_model_1 = __importDefault(require("../models/heating/valve.model"));
var valve_model_2 = __importDefault(require("../models/ghost/heating/valve.model"));
var fitting_model_1 = __importDefault(require("../models/heating/fitting.model"));
var pipe_model_2 = __importDefault(require("../models/ghost/heating/pipe.model"));
var radiator_model_2 = __importDefault(require("../models/ghost/heating/radiator.model"));
var Canvas = /** @class */ (function () {
    function Canvas(model) {
        this.pipe = null;
        this.valve = null;
        this.fitting = null;
        this.radiator = null;
        this.zIndex = null;
        this.model = model;
        this.container = document.querySelector("#editor");
        this.init();
    }
    Canvas.prototype.init = function () {
        var _a;
        this.initCanvasContainer();
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (ctx) {
            this.pipe = new pipe_view_1.default(this, this.model, ctx);
            this.valve = new valve_view_1.default(this, this.model, ctx);
            this.fitting = new fitting_view_1.default(this, this.model, ctx);
            this.radiator = new radiator_view_1.default(this, this.model, ctx);
            this.zIndex = new radiator_view_1.default(this, this.model, ctx);
        }
    };
    Canvas.prototype.draw = function () {
        var _this = this;
        var _a, _b, _c;
        this.clear();
        this.drawNet();
        this.drawWalls();
        var _d = this.model, pipes = _d.pipes, walls = _d.walls, radiators = _d.radiators, valves = _d.valves, fittings = _d.fittings;
        var objects = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], pipes, true), walls, true), radiators, true), valves, true), fittings, true).sort(function (a, b) {
            return a.z - b.z;
        });
        objects.map(function (object) {
            var _a, _b, _c, _d;
            if (object instanceof pipe_model_1.default) {
                (_a = _this.pipe) === null || _a === void 0 ? void 0 : _a.drawPipe(object);
            }
            if (object instanceof wall_model_1.default) {
                // console.log("Wall");
                // this.drawWall(o);
            }
            if (object instanceof radiator_model_1.default) {
                // console.log("Radiator");
                (_b = _this.radiator) === null || _b === void 0 ? void 0 : _b.drawRadiator(object);
            }
            if (object instanceof valve_model_1.default) {
                // console.log("Vavle");
                (_c = _this.valve) === null || _c === void 0 ? void 0 : _c.drawValve(object);
            }
            if (object instanceof fitting_model_1.default) {
                (_d = _this.fitting) === null || _d === void 0 ? void 0 : _d.drawFitting(object);
            }
        });
        if (this.model.actionObject &&
            this.model.actionObject instanceof pipe_model_2.default) {
            (_a = this.pipe) === null || _a === void 0 ? void 0 : _a.drawGhost(this.model.actionObject);
        }
        if (this.model.placingObject &&
            this.model.placingObject instanceof valve_model_2.default) {
            (_b = this.valve) === null || _b === void 0 ? void 0 : _b.drawGhost(this.model.placingObject);
        }
        if (this.model.placingObject &&
            this.model.placingObject instanceof radiator_model_2.default) {
            (_c = this.radiator) === null || _c === void 0 ? void 0 : _c.drawGhost(this.model.placingObject);
        }
        // this.pipe?.draw();
        // this.valve?.draw();
        // this.fitting?.draw();
        // this.radiator?.draw();
        // this.zIndex?.draw(); // draw top elements in canvas
    };
    Canvas.prototype.clear = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        ctx.clearRect(0, 0, this.container.width, this.container.height);
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, 0, this.container.width, this.container.height);
        //f5f5f5
    };
    Canvas.prototype.drawMouse = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse)
            return;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.arc(this.model.mouse.x, this.model.mouse.y, 1, 0, 2 * Math.PI);
        ctx.restore();
    };
    Canvas.prototype.drawNet = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        if (!this.model.config.net.show)
            return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        var step = this.model.config.net.step * this.model.scale.amount;
        var h = this.container.height;
        var w = this.container.width;
        var netOffset = new vect_1.Vector(this.model.offset.x % step, this.model.offset.y % step);
        //x
        var iV = 0;
        var maxV = w / step;
        while (iV <= maxV) {
            var from = new vect_1.Vector(step * iV + netOffset.x, 0);
            var to = new vect_1.Vector(step * iV + netOffset.x, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        //y
        var iH = 0;
        var maxH = h / step;
        while (iH <= maxH) {
            var from = new vect_1.Vector(0, step * iH + netOffset.y);
            var to = new vect_1.Vector(w, step * iH + netOffset.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iH++;
        }
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawNet1 = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        if (!this.model.config.net.show)
            return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        // let step = this.model.config.net.step * this.model.scale.amount;
        var step = this.model.config.net.step;
        var h = this.container.height;
        var w = this.container.width;
        //x
        var iV = 0;
        var maxV = w / step;
        while (iV <= maxV) {
            var from = this.model.getLocalCoordinates(step * iV, 0);
            var to = this.model.getLocalCoordinates(step * iV, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        //y
        var iH = 0;
        var maxH = h / step;
        while (iH <= maxH) {
            var from = this.model.getLocalCoordinates(0, step * iH);
            var to = this.model.getLocalCoordinates(w, step * iH);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iH++;
        }
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawAxis = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        if (!this.model.config.axis.show)
            return;
        ctx.save();
        ctx.beginPath();
        var h = this.container.height;
        var w = this.container.width;
        var x_From = this.model.getLocalCoordinates(0, 0);
        var x_To = this.model.getLocalCoordinates(w, 0);
        var y_From = this.model.getLocalCoordinates(0, 0);
        var y_To = this.model.getLocalCoordinates(0, h);
        ctx.moveTo(0, x_From.y);
        ctx.lineTo(w, x_To.y);
        ctx.moveTo(y_From.x, 0);
        ctx.lineTo(y_To.x, h);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawWalls = function () {
        var _this = this;
        var walls = this.model.walls;
        walls === null || walls === void 0 ? void 0 : walls.map(function (wall) {
            if (!_this.container)
                return;
            var ctx = _this.container.getContext("2d");
            if (!ctx)
                return;
            ctx.save();
            ctx.beginPath();
            var from = _this.model.getLocalCoordinates(wall.from.vec.x, wall.from.vec.y);
            var to = _this.model.getLocalCoordinates(wall.from.vec.x, wall.from.vec.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = wall.color;
            ctx.lineWidth = wall.width;
            ctx.stroke();
            ctx.restore();
        });
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
