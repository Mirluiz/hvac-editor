"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_model_1 = __importDefault(require("../models/ghost/heating/pipe.model"));
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
        var from = this.canvas.getWorldCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.getWorldCoordinates(pipe.to.vec.x, pipe.to.vec.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width;
        if (this.canvas.model.overlap.list.find(function (l) { return l.id === pipe.id; })) {
            this.ctx.shadowOffsetX = 4;
            this.ctx.shadowOffsetY = 4;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = "gray";
        }
        this.ctx.stroke();
        this.ctx.restore();
    };
    Pipe.prototype.drawGhost = function (pipe) {
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.getWorldCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.getWorldCoordinates(pipe.to.vec.x, pipe.to.vec.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width * 2;
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
        // this.canvas.model.overlap.list.map((l) => {
        //   if (l) {
        //     let _p = this.canvas.model.getPipeByID(l.id);
        //     if (_p && l.ioVector) {
        //       this.drawOverLap(l.ioVector);
        //     }
        //   }
        // });
    };
    Pipe.prototype.draw = function () {
        this.drawPipes();
        this.drawOverLaps();
        if (this.canvas.model.actionObject &&
            this.canvas.model.actionObject instanceof pipe_model_1.default) {
            this.drawGhost(this.canvas.model.actionObject);
        }
    };
    return Pipe;
}());
exports.default = Pipe;
