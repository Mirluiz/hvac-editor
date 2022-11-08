import { IVec, Vector } from "../../geometry/vect";
import CanvasModel from "../models/canvas.model";
import PipeView from "./pipe.view";
import ValveView from "./valve.view";
import FittingView from "./fitting.view";
import RadiatorView from "./radiator.view";
import Pipe from "../models/heating/pipe.model";
import PipeGhost from "../models/ghost/heating/pipe.model";
import Wall from "../models/architecture/wall.model";
import Radiator from "../models/heating/radiator.model";
import Valve from "../models/heating/valve.model";
import ValveGhostModel from "../models/ghost/heating/valve.model";
import Fitting from "../models/heating/fitting.model";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import RadiatorModel from "../models/ghost/heating/radiator.model";

class Canvas {
  model: CanvasModel;
  container: HTMLCanvasElement | null;
  pipe: PipeView | null = null;
  valve: ValveView | null = null;
  fitting: FittingView | null = null;
  radiator: RadiatorView | null = null;
  zIndex: any | null = null;

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
      this.radiator = new RadiatorView(this, this.model, ctx);
      this.zIndex = new RadiatorView(this, this.model, ctx);
    }
  }

  draw() {
    this.clear();
    this.drawNet();
    this.drawWalls();

    let { pipes, walls, radiators, valves, fittings } = this.model;

    let objects = [
      ...pipes,
      ...walls,
      ...radiators,
      ...valves,
      ...fittings,
    ].sort((a, b) => {
      return a.z - b.z;
    });

    objects.map((object) => {
      if (object instanceof Pipe) {
        this.pipe?.drawPipe(object);
      }

      if (object instanceof Wall) {
        // console.log("Wall");
        // this.drawWall(o);
      }

      if (object instanceof Radiator) {
        // console.log("Radiator");
        this.radiator?.drawRadiator(object);
      }

      if (object instanceof Valve) {
        // console.log("Vavle");
        this.valve?.drawValve(object);
      }

      if (object instanceof Fitting) {
        this.fitting?.drawFitting(object);
      }
    });

    if (
      this.model.actionObject &&
      this.model.actionObject instanceof PipeGhostModel
    ) {
      this.pipe?.drawGhost(this.model.actionObject);
    }

    if (
      this.model.placingObject &&
      this.model.placingObject instanceof ValveGhostModel
    ) {
      this.valve?.drawGhost(this.model.placingObject);
    }

    if (
      this.model.placingObject &&
      this.model.placingObject instanceof RadiatorModel
    ) {
      this.radiator?.drawGhost(this.model.placingObject);
    }

    // this.pipe?.draw();
    // this.valve?.draw();
    // this.fitting?.draw();
    // this.radiator?.draw();
    // this.zIndex?.draw(); // draw top elements in canvas
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

    let h =
      Math.ceil(screen.height / this.model.config.net.step) *
      this.model.config.net.step;
    let w =
      Math.ceil(screen.width / this.model.config.net.step) *
      this.model.config.net.step;

    this.container.style.height = h + "px";
    this.container.style.width = w + "px";
    this.container.height = h;
    this.container.width = w;

    this.model.canvasSize = {
      y: h,
      x: w,
    };
  }
}

export default Canvas;
