import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";

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

  draw() {
    this.drawPipes();
    // this.drawGhost();
  }
}

export default Pipe;
