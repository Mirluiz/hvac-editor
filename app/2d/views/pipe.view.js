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
        var from = this.canvas.model.getLocalCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.model.getLocalCoordinates(pipe.to.vec.x, pipe.to.vec.y);
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
        var _this = this;
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
        setTimeout(function () {
            var _a, _b;
            if ((_a = pipe.from.target) === null || _a === void 0 ? void 0 : _a.io) {
                var _wp = pipe.from.target.io.getVecAbs();
                _this.ctx.save();
                _this.ctx.beginPath();
                _this.ctx.strokeStyle = "red";
                _this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
                _this.ctx.fillStyle = "#ADD8E6";
                _this.ctx.fill();
                _this.ctx.restore();
            }
            if ((_b = pipe.to.target) === null || _b === void 0 ? void 0 : _b.io) {
                var _wp = pipe.to.target.io.getVecAbs();
                _this.ctx.save();
                _this.ctx.beginPath();
                _this.ctx.strokeStyle = "red";
                _this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
                _this.ctx.fillStyle = "#ADD8E6";
                _this.ctx.fill();
                _this.ctx.restore();
            }
        });
    };
    Pipe.prototype.drawOverLap = function (coordinate) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.model.getLocalCoordinates(coordinate.x, coordinate.y);
        this.ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.restore();
    };
    Pipe.prototype.drawOverLaps = function () {
        var _this = this;
        this.canvas.model.overlap.list.map(function (l) {
            var _a;
            if (l) {
                var _p = _this.canvas.model.getPipeByID(l.id);
                if (_p && ((_a = l.body) === null || _a === void 0 ? void 0 : _a.vec)) {
                    _this.drawOverLap(l.body.vec);
                }
            }
        });
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
