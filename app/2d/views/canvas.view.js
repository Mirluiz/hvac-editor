"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasView = /** @class */ (function () {
    function CanvasView(model) {
        this.model = model;
        this.container = document.querySelector("#editor");
        this.init();
    }
    CanvasView.prototype.init = function () {
        this.initCanvasContainer();
    };
    CanvasView.prototype.draw = function () {
        this.clear();
        this.drawNet();
        this.drawAxis();
        this.drawMouse();
    };
    CanvasView.prototype.clear = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        ctx.clearRect(0, 0, this.container.width, this.container.height);
    };
    CanvasView.prototype.drawMouse = function () {
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
    CanvasView.prototype.drawNet = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container)
            return;
        if (!this.model.config.net.show)
            return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        var step = this.model.config.net.step;
        var h = this.container.height;
        var w = this.container.width;
        var iV = 0;
        var maxV = w / step;
        while (iV < maxV) {
            var from = this.getWorldCoordinates(step * iV, 0);
            var to = this.getWorldCoordinates(step * iV, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        var iH = 0;
        var maxH = h / step;
        while (iH < maxH) {
            var from = this.getWorldCoordinates(0, step * iH);
            var to = this.getWorldCoordinates(w, step * iH);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iH++;
        }
        ctx.stroke();
        ctx.restore();
    };
    CanvasView.prototype.drawAxis = function () {
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
    //TODO: apply scale transformation here
    CanvasView.prototype.getWorldCoordinates = function (x, y) {
        return {
            x: x + this.model.offset.x,
            y: y + this.model.offset.y,
        };
    };
    CanvasView.prototype.getLocalCoordinates = function (x, y) {
        return {
            x: x + this.model.offset.x,
            y: y + this.model.offset.y,
        };
    };
    CanvasView.prototype.initCanvasContainer = function () {
        if (!this.container)
            return;
        this.container.style.height = "600px";
        this.container.style.width = "900px";
        this.container.height = 600;
        this.container.width = 900;
        this.container.style.border = "1px solid black";
    };
    return CanvasView;
}());
exports.default = CanvasView;
