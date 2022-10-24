import { IVec, Vector } from "../../geometry/vect";
import CanvasModel from "../models/canvas.model";
import Valve from "../models/heating/valve.model";
import Line from "../models/geometry/line.model";
import Pipe from "../models/heating/pipe.model";

class Canvas {
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
    this.drawMouse();
    this.drawWalls();
    this.drawPipes();
    this.drawValves();
    this.drawTempObjects();
    this.drawNearestObject();
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

  drawWalls() {
    let walls = this.model.walls;

    walls?.map((wall) => {
      if (!this.container) return;

      const ctx = this.container.getContext("2d");

      if (!ctx) return;

      ctx.save();
      ctx.beginPath();

      let from = this.getWorldCoordinates(wall.start.x, wall.start.y);
      let to = this.getWorldCoordinates(wall.end.x, wall.end.y);

      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);

      console.log("wall.color", wall.color);
      ctx.strokeStyle = wall.color;
      ctx.lineWidth = wall.width;

      ctx.stroke();
      ctx.restore();
    });
  }

  drawPipes() {
    let pipes = this.model.pipes;

    pipes?.map((pipe) => {
      this.drawLine(pipe);
    });
  }

  drawLine(line: Line) {
    if (!this.container) return;

    const ctx = this.container.getContext("2d");

    if (!ctx) return;

    ctx.save();
    ctx.beginPath();

    let from = this.getWorldCoordinates(line.start.x, line.start.y);
    let to = this.getWorldCoordinates(line.end.x, line.end.y);

    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);

    ctx.strokeStyle = line.color;
    ctx.lineWidth = line.width;

    ctx.stroke();
    ctx.restore();
  }

  drawValves() {
    let valves = this.model.valves;

    valves?.map((valve) => {
      this.drawValve(valve);
    });
  }

  drawValve(valve: Valve) {
    if (!this.container) return;

    const ctx = this.container.getContext("2d");

    if (!ctx) return;

    ctx.save();
    ctx.beginPath();

    let c = this.getWorldCoordinates(valve.center.x, valve.center.y);

    ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);

    ctx.fillStyle = "black";

    ctx.fill();
    ctx.restore();
  }

  drawTempObjects() {
    if (this.model.placingObject instanceof Valve) {
      this.drawValve(this.model.placingObject);
    }

    if (this.model.actionObject instanceof Pipe) {
      this.drawLine(this.model.actionObject);
    }
  }

  drawNearestObject() {
    if (this.model.actionObject instanceof Pipe) {
      if (this.model.nearestObject) {
        let line = new Line(
          this.model.actionObject.end,
          this.model.nearestObject
        );

        line.color = "green";

        this.drawLine(line);
      }
    }
  }

  //TODO: apply scale transformation here
  getWorldCoordinates(x: number, y: number): IVec {
    let _this = this;

    let scale = function (vec: IVec): Vector {
      return new Vector(
        vec.x * _this.model.scale.amount,
        vec.y * _this.model.scale.amount
      );
    };

    let translate = function (vec: IVec): Vector {
      return new Vector(
        vec.x + _this.model.offset.x,
        vec.y + _this.model.offset.y
      );
    }.bind(this);

    let t = new Vector(x, y);
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

export default Canvas;
