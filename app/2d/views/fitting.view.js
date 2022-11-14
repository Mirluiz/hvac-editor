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
        var _a;
        this.ctx.save();
        this.ctx.beginPath();
        // switch (fitting.type) {
        //   case "2d":
        //     {
        //       let pipe1 = fitting.pipes[0];
        //       let pipe2 = fitting.pipes[1];
        //       let pipe1End, pipe1OppositeEnd, pipe2End, pipe2OppositeEnd;
        //
        //       pipe1End =
        //         pipe1.from.target?.id === fitting.id ? pipe1.from : pipe1.to;
        //       pipe1OppositeEnd = pipe1End.getOpposite();
        //
        //       pipe2End =
        //         pipe2.from.target?.id === fitting.id ? pipe2.from : pipe2.to;
        //       pipe2OppositeEnd = pipe2End.getOpposite();
        //
        //       if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd)
        //         break;
        //
        //       let fitting1N = pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize();
        //       let fitting2N = pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize();
        //
        //       // console.log(
        //       //   "fitting1N.angle();",
        //       //   fitting1N.angle1(fitting2N) * (180 / Math.PI),
        //       //   fitting2N.angle1(fitting1N) * (180 / Math.PI)
        //       // );
        //
        //       let fittingNeck1Left = fitting1N
        //         .perpendicular("left")
        //         .multiply(fitting.width)
        //         .sum(fitting1N.multiply(fitting.width))
        //         .sum(fitting.center);
        //       let fittingNeck1Right = fitting1N
        //         .perpendicular("right")
        //         .multiply(fitting.width)
        //         .sum(fitting1N.multiply(fitting.width))
        //         .sum(fitting.center);
        //       let fittingNeck2Left = fitting2N
        //         .perpendicular("left")
        //         .multiply(fitting.width)
        //         .sum(fitting2N.multiply(fitting.width))
        //         .sum(fitting.center);
        //       let fittingNeck2Right = fitting2N
        //         .perpendicular("right")
        //         .multiply(fitting.width)
        //         .sum(fitting2N.multiply(fitting.width))
        //         .sum(fitting.center);
        //
        //       let pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
        //       let pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
        //       let needBezier = pipe1Angle - pipe2Angle !== 0;
        //
        //       let p1 = this.canvas.model.getLocalCoordinates(
        //         fittingNeck1Right.x,
        //         fittingNeck1Right.y
        //       );
        //       let p2 = this.canvas.model.getLocalCoordinates(
        //         fittingNeck1Left.x,
        //         fittingNeck1Left.y
        //       );
        //       let p3 = this.canvas.model.getLocalCoordinates(
        //         fittingNeck2Right.x,
        //         fittingNeck2Right.y
        //       );
        //       let p4 = this.canvas.model.getLocalCoordinates(
        //         fittingNeck2Left.x,
        //         fittingNeck2Left.y
        //       );
        //
        //       this.ctx.moveTo(p1.x, p1.y);
        //
        //       if (needBezier) {
        //         let curve = fitting1N
        //           .perpendicular("right")
        //           .sum(fitting2N.perpendicular("left"))
        //           .normalize()
        //           .multiply(fitting.width)
        //           .sum(fitting.center);
        //         let c = this.canvas.model.getLocalCoordinates(curve.x, curve.y);
        //         this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p4.x, p4.y);
        //       } else {
        //         this.ctx.lineTo(p4.x, p4.y);
        //       }
        //
        //       this.ctx.lineTo(p3.x, p3.y);
        //       if (needBezier) {
        //         let curve = fitting2N
        //           .perpendicular("right")
        //           .sum(fitting1N.perpendicular("left"))
        //           .normalize()
        //           .multiply(fitting.width)
        //           .sum(fitting.center);
        //         let c = this.canvas.model.getLocalCoordinates(curve.x, curve.y);
        //         this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p2.x, p2.y);
        //       } else {
        //         this.ctx.lineTo(p2.x, p2.y);
        //       }
        //
        //       if (this.canvas.model.overlap.first?.id === fitting.id) {
        //         this.ctx.shadowBlur = 5;
        //         this.ctx.shadowColor = "gray";
        //       }
        //
        //       this.ctx.closePath();
        //       this.ctx.stroke();
        //       this.ctx.fillStyle = "black";
        //       this.ctx.fill();
        //     }
        //     break;
        //   case "3d":
        //     {
        //       let pipe1 = fitting.pipes[0];
        //       let pipe2 = fitting.pipes[1];
        //       let pipe3 = fitting.pipes[2];
        //       let pipe1End,
        //         pipe1OppositeEnd,
        //         pipe2End,
        //         pipe2OppositeEnd,
        //         pipe3End,
        //         pipe3OppositeEnd;
        //
        //       pipe1End =
        //         pipe1.from.target?.id === fitting.id ? pipe1.from : pipe1.to;
        //       pipe1OppositeEnd = pipe1End.getOpposite();
        //
        //       pipe2End =
        //         pipe2.from.target?.id === fitting.id ? pipe2.from : pipe2.to;
        //       pipe2OppositeEnd = pipe2End.getOpposite();
        //
        //       pipe3End =
        //         pipe3.from.target?.id === fitting.id ? pipe3.from : pipe3.to;
        //       pipe3OppositeEnd = pipe3End.getOpposite();
        //
        //       if (
        //         !pipe1End ||
        //         !pipe2End ||
        //         !pipe3End ||
        //         !pipe3OppositeEnd ||
        //         !pipe1OppositeEnd ||
        //         !pipe2OppositeEnd
        //       )
        //         break;
        //
        //       let necks: Array<IVec> = [];
        //       let fittingNormalized = [
        //         pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize(),
        //         pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize(),
        //         pipe3OppositeEnd.vec.sub(pipe3End.vec).normalize(),
        //       ];
        //
        //       fittingNormalized.sort((a, b) => {
        //         return a.angle() - b.angle();
        //       });
        //
        //       fittingNormalized.map((n) => {
        //         necks.push(
        //           n
        //             .multiply(fitting.width)
        //             .sub(n.multiply(fitting.width).perpendicular("right"))
        //             .sum(fitting.center),
        //           n
        //             .multiply(fitting.width)
        //             .sub(n.multiply(fitting.width).perpendicular("left"))
        //             .sum(fitting.center)
        //         );
        //       });
        //
        //       necks.map((p, index) => {
        //         let wP = this.canvas.model.getLocalCoordinates(p.x, p.y);
        //
        //         if (index === 0) this.ctx.moveTo(wP.x, wP.y);
        //
        //         this.ctx.lineTo(wP.x, wP.y);
        //       });
        //
        //       this.ctx.closePath();
        //       this.ctx.stroke();
        //       this.ctx.fillStyle = "black";
        //       this.ctx.fill();
        //     }
        //     break;
        //   case "4d":
        //     console.log("4d");
        //     break;
        //   default:
        //     console.warn("no type");
        // }
        var wP = this.canvas.model.getLocalCoordinates(fitting.center.x, fitting.center.y);
        this.ctx.strokeStyle = "red";
        this.ctx.arc(wP.x, wP.y, fitting.width / 2, 0, 2 * Math.PI);
        if (((_a = this.canvas.model.overlap.first) === null || _a === void 0 ? void 0 : _a.id) === fitting.id) {
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = "gray";
        }
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.restore();
    };
    Fitting.prototype.draw = function () {
        this.drawFittings();
    };
    return Fitting;
}());
exports.default = Fitting;
