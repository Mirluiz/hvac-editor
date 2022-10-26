import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";
import { IVec } from "../../geometry/vect";

class Pipe {
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

  drawPipes() {
    this.canvas.model.pipes.map((p) => {
      this.drawPipe(p);
    });
  }

  drawPipe(pipe: PipeModel) {
    this.ctx.save();
    this.ctx.beginPath();

    let from = this.canvas.getWorldCoordinates(pipe.start.x, pipe.start.y);
    let to = this.canvas.getWorldCoordinates(pipe.end.x, pipe.end.y);

    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);

    this.ctx.strokeStyle = pipe.color;
    this.ctx.lineWidth = pipe.width;

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawOverLap(coordinate: IVec) {
    this.ctx.save();
    this.ctx.beginPath();

    let c = this.canvas.getWorldCoordinates(coordinate.x, coordinate.y);

    this.ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);

    this.ctx.fillStyle = "black";

    this.ctx.fill();
    this.ctx.restore();
  }

  drawOverLaps() {
    this.canvas.model.overlap.list.map((l) => {
      if (l) {
        let _p = this.canvas.model.getPipeByID(l.id);
        if (_p && l.partCoordinate) {
          this.drawOverLap(l.partCoordinate);
        }
      }
    });
  }

  draw() {
    this.drawPipes();
    this.drawOverLaps();
  }
}

export default Pipe;
