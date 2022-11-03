import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";
import ValveModel from "../models/heating/valve.model";
import FittingModel from "../models/heating/fitting.model";
import { Vector } from "../../geometry/vect";

class Fitting {
  canvas: CanvasView;
  ctx: CanvasRenderingContext2D;

  constructor(
    view: CanvasView,
    model: CanvasModel,
    ctx: CanvasRenderingContext2D
  ) {
    this.canvas = view;
    this.ctx = ctx;
  }

  drawFittings() {
    this.canvas.model.fittings.map((fitting) => {
      this.drawFitting(fitting);
    });
  }

  drawFitting(fitting: FittingModel) {
    this.ctx.save();
    this.ctx.beginPath();

    switch (fitting.type) {
      case "2d":
        {
          let pipe1 = fitting.pipes[0];
          let pipe2 = fitting.pipes[1];
          let pipe1End, pipe1OppositeEnd, pipe2End, pipe2OppositeEnd;

          pipe1End =
            pipe1.from.target?.id === fitting.id ? pipe1.from : pipe1.to;
          pipe1OppositeEnd = pipe1End.getOpposite();

          pipe2End =
            pipe2.from.target?.id === fitting.id ? pipe2.from : pipe2.to;
          pipe2OppositeEnd = pipe2End.getOpposite();

          if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd)
            break;

          let fitting1N = pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize();
          let fitting2N = pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize();

          let fittingNeck1Left = fitting1N
            .perpendicular("left")
            .multiply(fitting.neck)
            .sum(fitting1N.multiply(fitting.neck))
            .sum(fitting.center);
          let fittingNeck1Right = fitting1N
            .perpendicular("right")
            .multiply(fitting.neck)
            .sum(fitting1N.multiply(fitting.neck))
            .sum(fitting.center);
          let fittingNeck2Left = fitting2N
            .perpendicular("left")
            .multiply(fitting.neck)
            .sum(fitting2N.multiply(fitting.neck))
            .sum(fitting.center);
          let fittingNeck2Right = fitting2N
            .perpendicular("right")
            .multiply(fitting.neck)
            .sum(fitting2N.multiply(fitting.neck))
            .sum(fitting.center);

          let pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
          let pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
          let needBezier = pipe1Angle - pipe2Angle !== 0;

          let p1 = this.canvas.model.getWorldCoordinates(
            fittingNeck1Right.x,
            fittingNeck1Right.y
          );
          let p2 = this.canvas.model.getWorldCoordinates(
            fittingNeck1Left.x,
            fittingNeck1Left.y
          );
          let p3 = this.canvas.model.getWorldCoordinates(
            fittingNeck2Right.x,
            fittingNeck2Right.y
          );
          let p4 = this.canvas.model.getWorldCoordinates(
            fittingNeck2Left.x,
            fittingNeck2Left.y
          );

          this.ctx.moveTo(p1.x, p1.y);

          if (needBezier) {
            let curve = fitting1N
              .perpendicular("right")
              .sum(fitting2N.perpendicular("left"))
              .normalize()
              .multiply(fitting.neck)
              .sum(fitting.center);
            let c = this.canvas.model.getWorldCoordinates(curve.x, curve.y);
            this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p4.x, p4.y);
          } else {
            this.ctx.lineTo(p4.x, p4.y);
          }

          this.ctx.lineTo(p3.x, p3.y);
          if (needBezier) {
            let curve = fitting2N
              .perpendicular("right")
              .sum(fitting1N.perpendicular("left"))
              .normalize()
              .multiply(fitting.neck)
              .sum(fitting.center);
            let c = this.canvas.model.getWorldCoordinates(curve.x, curve.y);
            this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p2.x, p2.y);
          } else {
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
          let pipe1 = fitting.pipes[0];
          let pipe2 = fitting.pipes[1];
          let pipe3 = fitting.pipes[2];
          let pipe1End,
            pipe1OppositeEnd,
            pipe2End,
            pipe2OppositeEnd,
            pipe3End,
            pipe3OppositeEnd;

          pipe1End =
            pipe1.from.target?.id === fitting.id ? pipe1.from : pipe1.to;
          pipe1OppositeEnd = pipe1End.getOpposite();

          pipe2End =
            pipe2.from.target?.id === fitting.id ? pipe2.from : pipe2.to;
          pipe2OppositeEnd = pipe2End.getOpposite();

          pipe3End =
            pipe3.from.target?.id === fitting.id ? pipe3.from : pipe3.to;
          pipe3OppositeEnd = pipe3End.getOpposite();

          if (
            !pipe1End ||
            !pipe2End ||
            !pipe3End ||
            !pipe3OppositeEnd ||
            !pipe1OppositeEnd ||
            !pipe2OppositeEnd
          )
            break;

          let fitting1N = pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize();
          let fitting2N = pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize();
          let fitting3N = pipe3OppositeEnd.vec.sub(pipe3End.vec).normalize();

          let fittingNeck1 = {
            left: fitting1N
              .multiply(fitting.neck)
              .sub(fitting1N.multiply(fitting.neck).perpendicular("left"))
              .sum(fitting.center),
            right: fitting1N
              .multiply(fitting.neck)
              .sub(fitting1N.multiply(fitting.neck).perpendicular("right"))
              .sum(fitting.center),
          };
          let fittingNeck2 = {
            left: fitting2N
              .multiply(fitting.neck)
              .sub(fitting2N.perpendicular("left").multiply(fitting.neck))
              .sum(fitting.center),
            right: fitting2N
              .multiply(fitting.neck)
              .sub(fitting2N.perpendicular("right").multiply(fitting.neck))
              .sum(fitting.center),
          };
          let fittingNeck3 = {
            left: fitting3N
              .multiply(fitting.neck)
              .sub(fitting3N.multiply(fitting.neck).perpendicular("left"))
              .sum(fitting.center),
            right: fitting3N
              .multiply(fitting.neck)
              .sub(fitting3N.multiply(fitting.neck).perpendicular("right"))
              .sum(fitting.center),
          };

          let points = [fittingNeck1.left, fittingNeck1.right];

          // if (fitting1N.scalar(fitting2N) === 0) {
          //   console.log("-");
          //   points.push(fittingNeck2.left, fittingNeck2.right);
          // } else {
          //   console.log("--");
          //   points.push(fittingNeck2.right, fittingNeck2.left);
          // }
          //
          // if (fitting2N.scalar(fitting3N) === 0) {
          //   console.log("---");
          //   points.push(fittingNeck3.left, fittingNeck3.right);
          // } else {
          //   console.log("----");
          //   points.push(fittingNeck3.right, fittingNeck3.left);
          // }

          // points = points.sort((a, b) => {
          //   return (
          //     (a.x - fitting.center.x) * (b.y - fitting.center.y) -
          //     (b.x - fitting.center.x) * (a.y - fitting.center.y)
          //   );
          // });

          points.map((p, index) => {
            let wP = this.canvas.model.getWorldCoordinates(p.x, p.y);

            if (index === 0) this.ctx.moveTo(wP.x, wP.y);

            this.ctx.lineTo(wP.x, wP.y);
          });

          // this.ctx.closePath();
          this.ctx.stroke();
          // this.ctx.fillStyle = "black";
          // this.ctx.fill();
        }
        break;
      case "4d":
        console.log("4d");
        break;
      default:
        console.warn("no type");
    }

    this.ctx.restore();
  }

  draw() {
    this.drawFittings();
  }
}

export default Fitting;
