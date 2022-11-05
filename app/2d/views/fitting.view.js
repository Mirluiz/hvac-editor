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
        var _this = this;
        var _a, _b, _c, _d, _e;
        this.ctx.save();
        this.ctx.beginPath();
        switch (fitting.type) {
            case "2d":
                {
                    var pipe1 = fitting.pipes[0];
                    var pipe2 = fitting.pipes[1];
                    var pipe1End = void 0, pipe1OppositeEnd = void 0, pipe2End = void 0, pipe2OppositeEnd = void 0;
                    pipe1End =
                        ((_a = pipe1.from.target) === null || _a === void 0 ? void 0 : _a.id) === fitting.id ? pipe1.from : pipe1.to;
                    pipe1OppositeEnd = pipe1End.getOpposite();
                    pipe2End =
                        ((_b = pipe2.from.target) === null || _b === void 0 ? void 0 : _b.id) === fitting.id ? pipe2.from : pipe2.to;
                    pipe2OppositeEnd = pipe2End.getOpposite();
                    if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd)
                        break;
                    var fitting1N = pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize();
                    var fitting2N = pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize();
                    // console.log(
                    //   "fitting1N.angle();",
                    //   fitting1N.angle1(fitting2N) * (180 / Math.PI),
                    //   fitting2N.angle1(fitting1N) * (180 / Math.PI)
                    // );
                    var fittingNeck1Left = fitting1N
                        .perpendicular("left")
                        .multiply(fitting.neck)
                        .sum(fitting1N.multiply(fitting.neck))
                        .sum(fitting.center);
                    var fittingNeck1Right = fitting1N
                        .perpendicular("right")
                        .multiply(fitting.neck)
                        .sum(fitting1N.multiply(fitting.neck))
                        .sum(fitting.center);
                    var fittingNeck2Left = fitting2N
                        .perpendicular("left")
                        .multiply(fitting.neck)
                        .sum(fitting2N.multiply(fitting.neck))
                        .sum(fitting.center);
                    var fittingNeck2Right = fitting2N
                        .perpendicular("right")
                        .multiply(fitting.neck)
                        .sum(fitting2N.multiply(fitting.neck))
                        .sum(fitting.center);
                    var pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
                    var pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
                    var needBezier = pipe1Angle - pipe2Angle !== 0;
                    var p1 = this.canvas.model.getLocalCoordinates(fittingNeck1Right.x, fittingNeck1Right.y);
                    var p2 = this.canvas.model.getLocalCoordinates(fittingNeck1Left.x, fittingNeck1Left.y);
                    var p3 = this.canvas.model.getLocalCoordinates(fittingNeck2Right.x, fittingNeck2Right.y);
                    var p4 = this.canvas.model.getLocalCoordinates(fittingNeck2Left.x, fittingNeck2Left.y);
                    this.ctx.moveTo(p1.x, p1.y);
                    if (needBezier) {
                        var curve = fitting1N
                            .perpendicular("right")
                            .sum(fitting2N.perpendicular("left"))
                            .normalize()
                            .multiply(fitting.neck)
                            .sum(fitting.center);
                        var c = this.canvas.model.getLocalCoordinates(curve.x, curve.y);
                        this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p4.x, p4.y);
                    }
                    else {
                        this.ctx.lineTo(p4.x, p4.y);
                    }
                    this.ctx.lineTo(p3.x, p3.y);
                    if (needBezier) {
                        var curve = fitting2N
                            .perpendicular("right")
                            .sum(fitting1N.perpendicular("left"))
                            .normalize()
                            .multiply(fitting.neck)
                            .sum(fitting.center);
                        var c = this.canvas.model.getLocalCoordinates(curve.x, curve.y);
                        this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p2.x, p2.y);
                    }
                    else {
                        this.ctx.lineTo(p2.x, p2.y);
                    }
                    this.ctx.closePath();
                    this.ctx.stroke();
                    this.ctx.fillStyle = "black";
                    this.ctx.fill();
                }
                break;
            case "3d":
                {
                    var pipe1 = fitting.pipes[0];
                    var pipe2 = fitting.pipes[1];
                    var pipe3 = fitting.pipes[2];
                    var pipe1End = void 0, pipe1OppositeEnd = void 0, pipe2End = void 0, pipe2OppositeEnd = void 0, pipe3End = void 0, pipe3OppositeEnd = void 0;
                    pipe1End =
                        ((_c = pipe1.from.target) === null || _c === void 0 ? void 0 : _c.id) === fitting.id ? pipe1.from : pipe1.to;
                    pipe1OppositeEnd = pipe1End.getOpposite();
                    pipe2End =
                        ((_d = pipe2.from.target) === null || _d === void 0 ? void 0 : _d.id) === fitting.id ? pipe2.from : pipe2.to;
                    pipe2OppositeEnd = pipe2End.getOpposite();
                    pipe3End =
                        ((_e = pipe3.from.target) === null || _e === void 0 ? void 0 : _e.id) === fitting.id ? pipe3.from : pipe3.to;
                    pipe3OppositeEnd = pipe3End.getOpposite();
                    if (!pipe1End ||
                        !pipe2End ||
                        !pipe3End ||
                        !pipe3OppositeEnd ||
                        !pipe1OppositeEnd ||
                        !pipe2OppositeEnd)
                        break;
                    var necks_1 = [];
                    var fittingNormalized = [
                        pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize(),
                        pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize(),
                        pipe3OppositeEnd.vec.sub(pipe3End.vec).normalize(),
                    ];
                    fittingNormalized.sort(function (a, b) {
                        return a.angle() - b.angle();
                    });
                    fittingNormalized.map(function (n) {
                        necks_1.push(n
                            .multiply(fitting.neck)
                            .sub(n.multiply(fitting.neck).perpendicular("right"))
                            .sum(fitting.center), n
                            .multiply(fitting.neck)
                            .sub(n.multiply(fitting.neck).perpendicular("left"))
                            .sum(fitting.center));
                    });
                    necks_1.map(function (p, index) {
                        var wP = _this.canvas.model.getLocalCoordinates(p.x, p.y);
                        if (index === 0)
                            _this.ctx.moveTo(wP.x, wP.y);
                        _this.ctx.lineTo(wP.x, wP.y);
                    });
                    this.ctx.closePath();
                    this.ctx.stroke();
                    this.ctx.fillStyle = "black";
                    this.ctx.fill();
                }
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
