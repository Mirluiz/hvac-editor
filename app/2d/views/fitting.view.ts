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

    console.log("fitting.type", fitting.type);

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

        let pipe1Angle = pipe1.to.vec.sub(pipe1.from.vec).angle();
        let pipe2Angle = pipe2.to.vec.sub(pipe2.from.vec).angle();

        // let v1 = new Vector(Math.cos(pipe1Angle), Math.sin(pipe1Angle));
        // let v2 = new Vector(Math.cos(pipe2Angle), Math.sin(pipe2Angle));
        let v1 = pipe1.to.vec.sub(pipe1.from.vec).normalize();
        let v2 = pipe2.to.vec.sub(pipe2.from.vec).normalize();
        let r1 = v1.multiply(10);
        let r2 = v2.multiply(10);

        let pipe1Width = r1.perpendicular();
        let pipe2Width = r2.perpendicular();
        let pipe1NeckBottom = pipe1End.vec.sub(r1).sub(pipe1Width);
        let pipe1NeckTop = pipe1End.vec.sub(r1).sum(pipe1Width);
        let pipe2NeckTop = pipe2End.vec.sum(r2).sub(pipe2Width);
        let pipe2NeckBottom = pipe2End.vec.sum(r2).sum(pipe2Width);
        let topCurve = new Vector(-angleBetween.x, -angleBetween.y)
          .multiply(fitting.width)
          .sum(fitting.center);

        // pipe1NeckBottom.drawVector();
        // pipe1NeckTop.drawVector();
        // pipe2NeckTop.drawVector();
        // pipe2NeckBottom.drawVector();
        // topCurve.drawVector();
        //

        // let bottomCurve = angleBetween
        //   .multiply(fitting.width)
        //   .sum(fitting.center);
        //
        this.ctx.moveTo(pipe1NeckBottom.x, pipe1NeckBottom.y);
        this.ctx.lineTo(pipe1NeckTop.x, pipe1NeckTop.y);
        this.ctx.lineTo(topCurve.x, topCurve.y);
        this.ctx.lineTo(pipe2NeckBottom.x, pipe2NeckBottom.y);
        this.ctx.lineTo(pipe2NeckTop.x, pipe2NeckTop.y);
        // this.ctx.lineTo(bottomCurve.x, bottomCurve.y);
        // this.ctx.lineTo(pipe1NeckBottom.x, pipe1NeckBottom.y);
        // this.ctx.bezierCurveTo(
        //   topCurve.x,
        //   topCurve.y,
        //   topCurve.x,
        //   topCurve.y,
        //   pipe2NeckTop.x,
        //   pipe2NeckTop.y
        // );
        // this.ctx.lineTo(pipe2NeckBottom.x, pipe2NeckBottom.y);
        // this.ctx.bezierCurveTo(
        //   bottomCurve.x,
        //   bottomCurve.y,
        //   bottomCurve.x,
        //   bottomCurve.y,
        //   pipe1NeckBottom.x,
        //   pipe1NeckBottom.y
        // );
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

    // this.ctx.fillStyle = fitting.color;

    // this.ctx.fill();
    this.ctx.restore();
  }

  draw() {
    this.drawFittings();
  }
}

export default Fitting;
