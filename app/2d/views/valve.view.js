"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var valve_model_1 = __importDefault(require("../models/ghost/heating/valve.model"));
var vect_1 = require("../../geometry/vect");
var Valve = /** @class */ (function () {
    function Valve(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Valve.prototype.drawGhost = function (valve) {
        var _this = this;
        var _a;
        this.ctx.save();
        this.ctx.beginPath();
        var normVector, normVectorReversed;
        if (valve.pipes.length == 0) {
            normVector = new vect_1.Vector(1, 0);
            normVectorReversed = normVector.reverse();
        }
        else {
            var valvePipe = valve.pipes[0]; // get one from two pipe for angle detection
            var pipeEnd = ((_a = valvePipe.from.target) === null || _a === void 0 ? void 0 : _a.id) === valve.id ? valvePipe.from : valvePipe.to;
            var pipeOppositeEnd = pipeEnd.getOpposite();
            normVector = pipeOppositeEnd.vec.sub(pipeEnd.vec).normalize();
            normVectorReversed = normVector.reverse();
        }
        var points = [];
        points.push(normVector
            .multiply(valve.width)
            .perpendicular("left")
            .sum(normVector.multiply(valve.length))
            .sum(valve.center), normVector
            .multiply(valve.width)
            .perpendicular("right")
            .sum(normVector.multiply(valve.length))
            .sum(valve.center), normVector.sum(valve.center), normVectorReversed
            .multiply(valve.width)
            .perpendicular("left")
            .sum(normVectorReversed.multiply(valve.length))
            .sum(valve.center), normVectorReversed
            .multiply(valve.width)
            .perpendicular("right")
            .sum(normVectorReversed.multiply(valve.length))
            .sum(valve.center), normVector.sum(valve.center));
        points.map(function (p, index) {
            var wP = _this.canvas.model.getLocalCoordinates(p.x, p.y);
            if (index === 0)
                _this.ctx.moveTo(wP.x, wP.y);
            _this.ctx.lineTo(wP.x, wP.y);
        });
        this.ctx.lineWidth = 2;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        var wP = this.canvas.model.getLocalCoordinates(valve.center.x, valve.center.y);
        this.ctx.moveTo(wP.x, wP.y);
        this.ctx.arc(wP.x, wP.y, valve.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.restore();
    };
    Valve.prototype.drawValves = function () {
        var _this = this;
        this.canvas.model.valves.map(function (v) {
            _this.drawValve(v);
        });
    };
    Valve.prototype.drawValve = function (valve) {
        var _this = this;
        var _a;
        if (valve.pipes.length == 0)
            return;
        this.ctx.save();
        this.ctx.beginPath();
        var valvePipe = valve.pipes[0]; // get one from two pipe for angle detection
        var pipeEnd = ((_a = valvePipe.from.target) === null || _a === void 0 ? void 0 : _a.id) === valve.id ? valvePipe.from : valvePipe.to;
        var pipeOppositeEnd = pipeEnd.getOpposite();
        var normVector = pipeOppositeEnd.vec.sub(pipeEnd.vec).normalize();
        var normVectorReversed = normVector.reverse();
        var points = [];
        points.push(normVector
            .multiply(valve.width)
            .perpendicular("left")
            .sum(normVector.multiply(valve.length))
            .sum(valve.center), normVector
            .multiply(valve.width)
            .perpendicular("right")
            .sum(normVector.multiply(valve.length))
            .sum(valve.center), normVector.sum(valve.center), normVectorReversed
            .multiply(valve.width)
            .perpendicular("left")
            .sum(normVectorReversed.multiply(valve.length))
            .sum(valve.center), normVectorReversed
            .multiply(valve.width)
            .perpendicular("right")
            .sum(normVectorReversed.multiply(valve.length))
            .sum(valve.center), normVector.sum(valve.center));
        points.map(function (p, index) {
            var wP = _this.canvas.model.getLocalCoordinates(p.x, p.y);
            if (index === 0)
                _this.ctx.moveTo(wP.x, wP.y);
            _this.ctx.lineTo(wP.x, wP.y);
        });
        this.ctx.lineWidth = 2;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        var wP = this.canvas.model.getLocalCoordinates(valve.center.x, valve.center.y);
        this.ctx.moveTo(wP.x, wP.y);
        this.ctx.arc(wP.x, wP.y, valve.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.restore();
    };
    Valve.prototype.draw = function () {
        this.drawValves();
        if (this.canvas.model.placingObject &&
            this.canvas.model.placingObject instanceof valve_model_1.default) {
            this.drawGhost(this.canvas.model.placingObject);
        }
    };
    return Valve;
}());
exports.default = Valve;
