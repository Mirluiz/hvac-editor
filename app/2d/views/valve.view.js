"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Valve = /** @class */ (function () {
    function Valve(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Valve.prototype.drawValves = function () {
        var _this = this;
        this.canvas.model.valves.map(function (v) {
            _this.drawValve(v);
        });
    };
    Valve.prototype.drawValve = function (valve) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.model.getLocalCoordinates(valve.center.x, valve.center.y);
        this.ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = valve.color;
        this.ctx.fill();
        this.ctx.restore();
    };
    Valve.prototype.draw = function () {
        this.drawValves();
    };
    return Valve;
}());
exports.default = Valve;
