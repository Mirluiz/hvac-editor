"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
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
        var _a, _b, _c, _d;
        this.ctx.save();
        this.ctx.beginPath();
        // let c = this.canvas.getWorldCoordinates(fitting.center.x, fitting.center.y);
        // this.ctx.arc(c.x, c.y, fitting.radius, 0, 2 * Math.PI);
        switch (fitting.type) {
            case "2d":
                var pipe1 = fitting.pipes[0];
                var pipe2 = fitting.pipes[1];
                var pipe1End = void 0, pipe1OppositeEnd = void 0, pipe2End = void 0, pipe2OppositeEnd = void 0;
                if (((_a = pipe1.from.target) === null || _a === void 0 ? void 0 : _a.id) === fitting.id) {
                    pipe1End = pipe1.from;
                    pipe1OppositeEnd = pipe1.to;
                }
                else if (((_b = pipe1.to.target) === null || _b === void 0 ? void 0 : _b.id) === fitting.id) {
                    pipe1End = pipe1.to;
                    pipe1OppositeEnd = pipe1.from;
                }
                if (((_c = pipe2.from.target) === null || _c === void 0 ? void 0 : _c.id) === fitting.id) {
                    pipe2End = pipe2.from;
                    pipe2OppositeEnd = pipe2.to;
                }
                else if (((_d = pipe2.to.target) === null || _d === void 0 ? void 0 : _d.id) === fitting.id) {
                    pipe2End = pipe2.to;
                    pipe2OppositeEnd = pipe2.from;
                }
                if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd)
                    break;
                var angleBetween = pipe1OppositeEnd.vec
                    .sub(fitting.center)
                    .normalize()
                    .sum(pipe2OppositeEnd.vec.sub(fitting.center).normalize());
                var v1 = pipe1End.vec
                    .sub(pipe1OppositeEnd.vec)
                    .normalize()
                    .multiply(10);
                var v2 = pipe2End.vec
                    .sub(pipe2OppositeEnd.vec)
                    .normalize()
                    .multiply(10);
                var pipe1Width = v1.perpendicular();
                var pipe2Width = v2.perpendicular();
                var pipe1NeckTop = pipe1End.vec.sub(v1).sum(pipe1Width);
                var pipe1NeckBottom = pipe1End.vec.sub(v1).sub(pipe1Width);
                var pipe2NeckTop = pipe2End.vec.sub(v2).sub(pipe2Width);
                var pipe2NeckBottom = pipe2End.vec.sub(v2).sum(pipe2Width);
                var topCurve = new vect_1.Vector(-angleBetween.x, -angleBetween.y)
                    .multiply(fitting.width)
                    .sum(fitting.center);
                var pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
                var pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
                var needBezier = pipe1Angle - pipe2Angle !== 0;
                var points = [
                    pipe1NeckTop,
                    pipe1NeckBottom,
                    pipe2NeckTop,
                    pipe2NeckBottom,
                ];
                points = points.sort(function (a, b) {
                    return ((a.x - fitting.center.x) * (b.y - fitting.center.y) -
                        (b.x - fitting.center.x) * (a.y - fitting.center.y));
                });
                this.ctx.moveTo(points[0].x, points[0].y);
                this.ctx.lineTo(points[1].x, points[1].y);
                this.ctx.lineTo(points[2].x, points[2].y);
                this.ctx.lineTo(points[3].x, points[3].y);
                if (needBezier) {
                    this.ctx.bezierCurveTo(topCurve.x, topCurve.y, topCurve.x, topCurve.y, points[0].x, points[0].y);
                }
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fillStyle = "black";
                this.ctx.fill();
                break;
            case "3d":
                console.log("3d");
                break;
            case "4d":
                console.log("4d");
                break;
            default:
                console.warn("no type");
        }
        this.ctx.restore();
    };
    Fitting.prototype.draw = function () {
        this.drawFittings();
    };
    return Fitting;
}());
exports.default = Fitting;
