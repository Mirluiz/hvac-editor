"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var pipe_view_1 = __importDefault(require("./pipe.view"));
var valve_view_1 = __importDefault(require("./valve.view"));
var fitting_view_1 = __importDefault(require("./fitting.view"));
var Canvas = /** @class */ (function () {
    function Canvas(model) {
        this.pipe = null;
        this.valve = null;
        this.fitting = null;
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
        }
    };
    Canvas.prototype.draw = function () {
        var _a, _b, _c;
        this.clear();
        this.drawNet();
        this.drawWalls();
        (_a = this.pipe) === null || _a === void 0 ? void 0 : _a.draw();
        (_b = this.valve) === null || _b === void 0 ? void 0 : _b.draw();
        (_c = this.fitting) === null || _c === void 0 ? void 0 : _c.draw();
    };
    Canvas.prototype.clear = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        ctx.clearRect(0, 0, this.container.width, this.container.height);
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
        this.container.style.height = "600px";
        this.container.style.width = "900px";
        this.container.height = 600;
        this.container.width = 900;
        this.container.style.border = "1px solid black";
        this.model.canvasSize = {
            y: 600,
            x: 900,
        };
    };
    return Canvas;
}());
exports.default = Canvas;
