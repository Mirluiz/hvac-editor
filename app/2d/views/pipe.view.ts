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

    if (this.canvas.model.overlap.list.find((l) => l.id === pipe.id)) {
      this.ctx.shadowOffsetX = 4;
      this.ctx.shadowOffsetY = 4;
      this.ctx.shadowBlur = 5;
      this.ctx.shadowColor = "gray";
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

    setTimeout(() => {
      if (pipe.from.target?.io) {
        let _wp = pipe.from.target.io.getVecAbs();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";
        this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#ADD8E6";
        this.ctx.fill();
        this.ctx.restore();
      }

      if (pipe.to.target?.io) {
        let _wp = pipe.to.target.io.getVecAbs();
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = "red";
        this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "#ADD8E6";
        this.ctx.fill();
        this.ctx.restore();
      }
    });
  }

  drawOverLap(coordinate: IVec) {
    this.ctx.save();
    this.ctx.beginPath();

    let c = this.canvas.model.getLocalCoordinates(coordinate.x, coordinate.y);

    this.ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);

    this.ctx.fillStyle = "black";

    this.ctx.fill();
    this.ctx.restore();
  }

  drawOverLaps() {
    this.canvas.model.overlap.list.map((l) => {
      if (l) {
        let _p = this.canvas.model.getPipeByID(l.id);
        if (_p && l.body?.vec) {
          this.drawOverLap(l.body.vec);
        }
      }
    });
  }

  draw() {
    this.drawPipes();
    this.drawOverLaps();

    if (
      this.canvas.model.actionObject &&
      this.canvas.model.actionObject instanceof PipeGhostModel
    ) {
      this.drawGhost(this.canvas.model.actionObject);
    }
  }
}

export default Pipe;
