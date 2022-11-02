import { IVec, Vector } from "../../geometry/vect";
import CanvasModel from "../models/canvas.model";
import PipeView from "./pipe.view";
import ValveView from "./valve.view";
import FittingView from "./fitting.view";

class Canvas {
  model: CanvasModel;
  container: HTMLCanvasElement | null;
  pipe: PipeView | null = null;
  valve: ValveView | null = null;
  fitting: FittingView | null = null;

  constructor(model: CanvasModel) {
    this.model = model;
    this.container = document.querySelector("#editor");

    this.init();
  }

  init() {
    this.initCanvasContainer();

    const ctx = this.container?.getContext("2d");

    if (ctx) {
      this.pipe = new PipeView(this, this.model, ctx);
      this.valve = new ValveView(this, this.model, ctx);
      this.fitting = new FittingView(this, this.model, ctx);
    }
  }

  draw() {
    this.clear();
    this.drawNet();
    this.drawWalls();

    this.pipe?.draw();
    this.valve?.draw();
    this.fitting?.draw();
  }

  clear() {
    const ctx = this.container?.getContext("2d");

    if (!ctx || !this.model.mouse || !this.container) return;

    ctx.clearRect(0, 0, this.container.width, this.container.height);
  }

  drawMouse() {
    const ctx = this.container?.getContext("2d");

    if (!ctx || !this.model.mouse) return;

    ctx.save();

    ctx.beginPath();
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.arc(this.model.mouse.x, this.model.mouse.y, 1, 0, 2 * Math.PI);

    ctx.restore();
  }

  drawNet() {
    const ctx = this.container?.getContext("2d");

    if (!ctx || !this.model.mouse || !this.container) return;
    if (!this.model.config.net.show) return;

    ctx.save();

    ctx.beginPath();
    ctx.lineWidth = 1;

    let step = this.model.config.net.step * this.model.scale.amount;
    let h = this.container.height;
    let w = this.container.width;
    let netOffset: IVec = new Vector(
      this.model.offset.x % step,
      this.model.offset.y % step
    );

    //x
    let iV = 0;
    let maxV = w / step;
    while (iV <= maxV) {
      let from: IVec = new Vector(step * iV + netOffset.x, 0);
      let to: IVec = new Vector(step * iV + netOffset.x, h);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      iV++;
    }

    //y
    let iH = 0;
    let maxH = h / step;
    while (iH <= maxH) {
      let from: IVec = new Vector(0, step * iH + netOffset.y);
      let to: IVec = new Vector(w, step * iH + netOffset.y);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);

      iH++;
    }

    ctx.globalAlpha = 0.2;

    ctx.stroke();
    ctx.restore();
  }

  drawNet1() {
    const ctx = this.container?.getContext("2d");

    if (!ctx || !this.model.mouse || !this.container) return;
    if (!this.model.config.net.show) return;

    ctx.save();

    ctx.beginPath();
    ctx.lineWidth = 1;

    // let step = this.model.config.net.step * this.model.scale.amount;
    let step = this.model.config.net.step;
    let h = this.container.height;
    let w = this.container.width;

    //x
    let iV = 0;
    let maxV = w / step;
    while (iV <= maxV) {
      let from: IVec = this.model.getLocalCoordinates(step * iV, 0);
      let to: IVec = this.model.getLocalCoordinates(step * iV, h);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      iV++;
    }

    //y
    let iH = 0;
    let maxH = h / step;
    while (iH <= maxH) {
      let from: IVec = this.model.getLocalCoordinates(0, step * iH);
      let to: IVec = this.model.getLocalCoordinates(w, step * iH);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);

      iH++;
    }

    ctx.stroke();
    ctx.restore();
  }

  drawAxis() {
    const ctx = this.container?.getContext("2d");

    if (!ctx || !this.model.mouse || !this.container) return;
    if (!this.model.config.axis.show) return;

    ctx.save();
    ctx.beginPath();

    let h = this.container.height;
    let w = this.container.width;

    let x_From = this.model.getLocalCoordinates(0, 0);
    let x_To = this.model.getLocalCoordinates(w, 0);
    let y_From = this.model.getLocalCoordinates(0, 0);
    let y_To = this.model.getLocalCoordinates(0, h);

    ctx.moveTo(0, x_From.y);
    ctx.lineTo(w, x_To.y);

    ctx.moveTo(y_From.x, 0);
    ctx.lineTo(y_To.x, h);
    ctx.strokeStyle = "red";

    ctx.stroke();
    ctx.restore();
  }

  drawWalls() {
    let walls = this.model.walls;

    walls?.map((wall) => {
      if (!this.container) return;

      const ctx = this.container.getContext("2d");

      if (!ctx) return;

      ctx.save();
      ctx.beginPath();

      let from = this.model.getLocalCoordinates(
        wall.from.vec.x,
        wall.from.vec.y
      );
      let to = this.model.getLocalCoordinates(wall.from.vec.x, wall.from.vec.y);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);

      ctx.strokeStyle = wall.color;
      ctx.lineWidth = wall.width;

      ctx.stroke();
      ctx.restore();
    });
  }

  initCanvasContainer(): void {
    if (!this.container) return;

    this.container.style.height = "600px";
    this.container.style.width = "900px";
    this.container.height = 600;
    this.container.width = 900;
    this.container.style.border = "1px solid black";

    this.model.canvasSize = {
      y: 600,
      x: 900,
    };
  }
}

export default Canvas;
