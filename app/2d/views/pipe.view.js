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
    Pipe.prototype.draw = function () {
        this.drawPipes();
        // this.drawGhost();
    };
    return Pipe;
}());
exports.default = Pipe;
