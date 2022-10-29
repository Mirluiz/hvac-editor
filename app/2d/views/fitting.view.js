"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Fitting = /** @class */ (function () {
    function Fitting(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Fitting.prototype.drawFittings = function () {
        var _this = this;
        this.canvas.model.fittings.map(function (fitting) {
            _this.drawFitting(fitting);
        });
    };
    Fitting.prototype.drawFitting = function (fitting) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.getWorldCoordinates(fitting.center.x, fitting.center.y);
        this.ctx.arc(c.x, c.y, fitting.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = fitting.color;
        this.ctx.fill();
        this.ctx.restore();
    };
    Fitting.prototype.draw = function () {
        this.drawFittings();
    };
    return Fitting;
}());
exports.default = Fitting;
