"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var Canvas = /** @class */ (function () {
    function Canvas(model) {
        this.model = model;
        this.container = document.querySelector("#editor");
        this.init();
    }
    Canvas.prototype.init = function () {
        this.initCanvasContainer();
    };
    Canvas.prototype.draw = function () {
        this.clear();
        this.drawNet();
        this.drawMouse();
        this.drawWalls();
        this.drawPipes();
        this.drawValves();
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
            var from = this.getWorldCoordinates(step * iV, 0);
            var to = this.getWorldCoordinates(step * iV, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        //y
        var iH = 0;
        var maxH = h / step;
        while (iH <= maxH) {
            var from = this.getWorldCoordinates(0, step * iH);
            var to = this.getWorldCoordinates(w, step * iH);
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
        var x_From = this.getWorldCoordinates(0, 0);
        var x_To = this.getWorldCoordinates(w, 0);
        var y_From = this.getWorldCoordinates(0, 0);
        var y_To = this.getWorldCoordinates(0, h);
        ctx.moveTo(0, x_From.y);
        ctx.lineTo(w, x_To.y);
        ctx.moveTo(y_From.x, 0);
        ctx.lineTo(y_To.x, h);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawWalls = function () {
        var _this_1 = this;
        var walls = this.model.walls;
        walls === null || walls === void 0 ? void 0 : walls.map(function (wall) {
            if (!_this_1.container)
                return;
            var ctx = _this_1.container.getContext("2d");
            if (!ctx)
                return;
            ctx.save();
            ctx.beginPath();
            var from = _this_1.getWorldCoordinates(wall.start.x, wall.start.y);
            var to = _this_1.getWorldCoordinates(wall.end.x, wall.end.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            console.log("wall.color", wall.color);
            ctx.strokeStyle = wall.color;
            ctx.lineWidth = wall.width;
            ctx.stroke();
            ctx.restore();
        });
    };
    Canvas.prototype.drawPipes = function () {
        var _this_1 = this;
        var pipes = this.model.pipes;
        pipes === null || pipes === void 0 ? void 0 : pipes.map(function (pipe) {
            _this_1.drawLine(pipe);
        });
    };
    Canvas.prototype.drawLine = function (line) {
        if (!this.container)
            return;
        var ctx = this.container.getContext("2d");
        if (!ctx)
            return;
        ctx.save();
        ctx.beginPath();
        var from = this.getWorldCoordinates(line.start.x, line.start.y);
        var to = this.getWorldCoordinates(line.end.x, line.end.y);
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawValves = function () {
        var _this_1 = this;
        var valves = this.model.valves;
        valves === null || valves === void 0 ? void 0 : valves.map(function (valve) {
            _this_1.drawValve(valve);
        });
    };
    Canvas.prototype.drawValve = function (valve) {
        if (!this.container)
            return;
        var ctx = this.container.getContext("2d");
        if (!ctx)
            return;
        ctx.save();
        ctx.beginPath();
        var c = this.getWorldCoordinates(valve.center.x, valve.center.y);
        ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
    };
    //TODO: apply scale transformation here
    Canvas.prototype.getWorldCoordinates = function (x, y) {
        var _this = this;
        var scale = function (vec) {
            return new vect_1.Vector(vec.x * _this.model.scale.amount, vec.y * _this.model.scale.amount);
        };
        var translate = function (vec) {
            return new vect_1.Vector(vec.x + _this.model.offset.x, vec.y + _this.model.offset.y);
        }.bind(this);
        var t = new vect_1.Vector(x, y);
        t = scale(t);
        // t = rotation(t); TODO order is scaling rotation translation
        t = translate(t);
        return t;
    };
    //x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord.x,
    //       y: (y + this.model.offset.y)  * this.model.scale.amount,
    // getLocalCoordinates(x: number, y: number) {
    //   return {
    //     x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord ,
    //     y: (y + this.model.offset.y)  * this.model.scale.amount,
    //   };
    // }
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
