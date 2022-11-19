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
        var _a;
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.model.getLocalCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.model.getLocalCoordinates(pipe.to.vec.x, pipe.to.vec.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        // this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width;
        if (((_a = this.canvas.model.overlap.first) === null || _a === void 0 ? void 0 : _a.id) === pipe.id) {
            this.ctx.shadowBlur = 5;
            // this.ctx.shadowColor = pipe.color;
        }
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.restore();
    };
    Pipe.prototype.drawGhost = function (pipe) {
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.model.getLocalCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.model.getLocalCoordinates(pipe.to.vec.x, pipe.to.vec.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width * 2;
        this.ctx.stroke();
        this.ctx.restore();
        // if (pipe.from.target?.io) {
        //   let _wp = pipe.from.target.io.getVecAbs();
        //   this.ctx.save();
        //   this.ctx.beginPath();
        //   this.ctx.strokeStyle = "red";
        //   this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
        //   this.ctx.fillStyle = "#ADD8E6";
        //   this.ctx.fill();
        //   this.ctx.restore();
        // }
        //
        // if (pipe.to.target?.io) {
        //   let _wp = pipe.to.target.io.getVecAbs();
        //   this.ctx.save();
        //   this.ctx.beginPath();
        //   this.ctx.strokeStyle = "red";
        //   this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
        //   this.ctx.fillStyle = "#ADD8E6";
        //   this.ctx.fill();
        //   this.ctx.restore();
        // }
    };
    return Pipe;
}());
exports.default = Pipe;
