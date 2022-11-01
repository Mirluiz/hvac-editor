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

    // let c = this.canvas.getWorldCoordinates(fitting.center.x, fitting.center.y);

    // this.ctx.arc(c.x, c.y, fitting.radius, 0, 2 * Math.PI);

    switch (fitting.type) {
      case "2d":
        let pipe1 = fitting.pipes[0];
        let pipe2 = fitting.pipes[1];
        let pipe1End, pipe1OppositeEnd, pipe2End, pipe2OppositeEnd;

        if (pipe1.from.target?.id === fitting.id) {
          pipe1End = pipe1.from;
          pipe1OppositeEnd = pipe1.to;
        } else if (pipe1.to.target?.id === fitting.id) {
          pipe1End = pipe1.to;
          pipe1OppositeEnd = pipe1.from;
        }

        if (pipe2.from.target?.id === fitting.id) {
          pipe2End = pipe2.from;
          pipe2OppositeEnd = pipe2.to;
        } else if (pipe2.to.target?.id === fitting.id) {
          pipe2End = pipe2.to;
          pipe2OppositeEnd = pipe2.from;
        }

        if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd)
          break;

        let angleBetween = pipe1OppositeEnd.vec
          .sub(fitting.center)
          .normalize()
          .sum(pipe2OppositeEnd.vec.sub(fitting.center).normalize());

        let v1 = pipe1End.vec
          .sub(pipe1OppositeEnd.vec)
          .normalize()
          .multiply(10);
        let v2 = pipe2End.vec
          .sub(pipe2OppositeEnd.vec)
          .normalize()
          .multiply(10);

        let pipe1Width = v1.perpendicular();
        let pipe2Width = v2.perpendicular();
        let pipe1NeckTop = pipe1End.vec.sub(v1).sum(pipe1Width);
        let pipe1NeckBottom = pipe1End.vec.sub(v1).sub(pipe1Width);
        let pipe2NeckTop = pipe2End.vec.sub(v2).sub(pipe2Width);
        let pipe2NeckBottom = pipe2End.vec.sub(v2).sum(pipe2Width);
        let topCurve = new Vector(-angleBetween.x, -angleBetween.y)
          .multiply(fitting.width)
          .sum(fitting.center);

        let pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
        let pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
        let needBezier = pipe1Angle - pipe2Angle !== 0;

        let points = [
          pipe1NeckTop,
          pipe1NeckBottom,
          pipe2NeckTop,
          pipe2NeckBottom,
        ];

        points = points.sort((a, b) => {
          return (
            (a.x - fitting.center.x) * (b.y - fitting.center.y) -
            (b.x - fitting.center.x) * (a.y - fitting.center.y)
          );
        });

        this.ctx.moveTo(points[0].x, points[0].y);
        this.ctx.lineTo(points[1].x, points[1].y);
        this.ctx.lineTo(points[2].x, points[2].y);
        this.ctx.lineTo(points[3].x, points[3].y);

        if (needBezier) {
          this.ctx.bezierCurveTo(
            topCurve.x,
            topCurve.y,
            topCurve.x,
            topCurve.y,
            points[0].x,
            points[0].y
          );
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
  }

  draw() {
    this.drawFittings();
  }
}

export default Fitting;
