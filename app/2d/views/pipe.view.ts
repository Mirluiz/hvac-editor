import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";
import { IVec } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";

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

    let from = this.canvas.model.getLocalCoordinates(
      pipe.from.vec.x,
      pipe.from.vec.y
    );
    let to = this.canvas.model.getLocalCoordinates(
      pipe.to.vec.x,
      pipe.to.vec.y
    );

    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);

    this.ctx.strokeStyle = pipe.color;
    this.ctx.lineWidth = pipe.width;

    if (this.canvas.model.overlap.first?.id === pipe.id) {
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = pipe.color;
    }

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawGhost(pipe: PipeGhostModel) {
    this.ctx.save();
    this.ctx.beginPath();

    let from = this.canvas.model.getLocalCoordinates(
      pipe.from.vec.x,
      pipe.from.vec.y
    );
    let to = this.canvas.model.getLocalCoordinates(
      pipe.to.vec.x,
      pipe.to.vec.y
    );

    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);

    this.ctx.strokeStyle = pipe.color;
    this.ctx.lineWidth = pipe.width * 2;

    this.ctx.stroke();
    this.ctx.restore();

    // if (pipe.from.target?.io) {
    //   let _wp = pipe.from.target.io.getVecAbs();
    //   this.ctx.save();
    //   this.ctx.beginPath();
    //   this.ctx.strokeStyle = "red";
    //   this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
    //   this.ctx.fillStyle = "#ADD8E6";
    //   this.ctx.fill();
    //   this.ctx.restore();
    // }
    //
    // if (pipe.to.target?.io) {
    //   let _wp = pipe.to.target.io.getVecAbs();
    //   this.ctx.save();
    //   this.ctx.beginPath();
    //   this.ctx.strokeStyle = "red";
    //   this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
    //   this.ctx.fillStyle = "#ADD8E6";
    //   this.ctx.fill();
    //   this.ctx.restore();
    // }
  }
}

export default Pipe;
