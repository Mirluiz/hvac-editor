import { IVec } from "../../geometry/vect";
import CanvasModel from "../models/canvas.model";

class CanvasView {
  model: CanvasModel;
  container: HTMLCanvasElement | null;

  constructor(model: CanvasModel) {
    this.model = model;
    this.container = document.querySelector("#editor");
    this.init();
  }

  init() {
    this.initCanvasContainer();
  }

  draw() {
    this.clear();
    this.drawNet();
    // this.drawNet1();
    this.drawAxis();
    this.drawMouse();
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
    let netOffset: IVec = {
      x: this.model.offset.x % step,
      y: this.model.offset.y % step,
    };

    //x
    let iV = 0;
    let maxV = w / step;
    while (iV <= maxV) {
      let from: IVec = { x: step * iV + netOffset.x, y: 0 };
      let to: IVec = { x: step * iV + netOffset.x, y: h };

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      iV++;
    }

    //y
    let iH = 0;
    let maxH = h / step;
    while (iH <= maxH) {
      let from: IVec = { x: 0, y: step * iH + netOffset.y };
      let to: IVec = { x: w, y: step * iH + netOffset.y };

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);

      iH++;
    }

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
      let from: IVec = this.getWorldCoordinates(step * iV, 0);
      let to: IVec = this.getWorldCoordinates(step * iV, h);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      iV++;
    }

    //y
    let iH = 0;
    let maxH = h / step;
    while (iH <= maxH) {
      let from: IVec = this.getWorldCoordinates(0, step * iH);
      let to: IVec = this.getWorldCoordinates(w, step * iH);

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

    let x_From = this.getWorldCoordinates(0, 0);
    let x_To = this.getWorldCoordinates(w, 0);
    let y_From = this.getWorldCoordinates(0, 0);
    let y_To = this.getWorldCoordinates(0, h);

    ctx.moveTo(0, x_From.y);
    ctx.lineTo(w, x_To.y);

    ctx.moveTo(y_From.x, 0);
    ctx.lineTo(y_To.x, h);
    ctx.strokeStyle = "red";

    ctx.stroke();
    ctx.restore();
  }

  //TODO: apply scale transformation here
  getWorldCoordinates(x: number, y: number): IVec {
    let _this = this;

    let translate = function (vec: IVec): IVec {
      return {
        x: vec.x + _this.model.offset.x,
        y: vec.y + _this.model.offset.y,
      };
    }.bind(this);

    let scale = function (vec: IVec): IVec {
      return {
        x: vec.x * _this.model.scale.amount,
        y: vec.y * _this.model.scale.amount,
      };
    };

    let t = { x, y };
    t = scale(t);
    // t = rotation(t); TODO order is scaling rotation translation
    t = translate(t);

    return t;
  }

  //x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord.x,
  //       y: (y + this.model.offset.y)  * this.model.scale.amount,
  // getLocalCoordinates(x: number, y: number) {
  //   return {
  //     x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord ,
  //     y: (y + this.model.offset.y)  * this.model.scale.amount,
  //   };
  // }

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

export default CanvasView;
