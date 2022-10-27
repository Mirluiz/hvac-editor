"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pipe = /** @class */ (function () {
    function Pipe(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Pipe.prototype.drawPipes = function () {
        var _this = this;
        this.canvas.model.pipes.map(function (p) {
            _this.drawPipe(p);
        });
    };
    Pipe.prototype.drawPipe = function (pipe) {
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.getWorldCoordinates(pipe.start.x, pipe.start.y);
        var to = this.canvas.getWorldCoordinates(pipe.end.x, pipe.end.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width;
        this.ctx.stroke();
        this.ctx.restore();
    };
    Pipe.prototype.drawOverLap = function (coordinate) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.getWorldCoordinates(coordinate.x, coordinate.y);
        this.ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.restore();
    };
    Pipe.prototype.drawOverLaps = function () {
        var _this = this;
        this.canvas.model.overlap.list.map(function (l) {
            if (l) {
                var _p = _this.canvas.model.getPipeByID(l.id);
                if (_p && l.partCoordinate) {
                    _this.drawOverLap(l.partCoordinate);
                }
            }
        });
    };
    Pipe.prototype.draw = function () {
        this.drawPipes();
        this.drawOverLaps();
    };
    return Pipe;
}());
exports.default = Pipe;
