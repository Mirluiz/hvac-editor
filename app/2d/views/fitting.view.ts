import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";
import ValveModel from "../models/heating/valve.model";
import FittingModel from "../models/heating/fitting.model";

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

    let c = this.canvas.getWorldCoordinates(fitting.center.x, fitting.center.y);

    this.ctx.arc(c.x, c.y, fitting.radius, 0, 2 * Math.PI);

    this.ctx.fillStyle = fitting.color;

    this.ctx.fill();
    this.ctx.restore();
  }

  draw() {
    this.drawFittings();
  }
}

export default Fitting;
