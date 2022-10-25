import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import Wall from "../models/architecture/wall.model";
import Pipe from "../models/heating/pipe.model";
import Line from "../models/geometry/line.model";
import Valve from "../models/heating/valve.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeModel from "../models/heating/pipe.model";

class Canvas {
  view: CanvasView;
  stats: StatsView;
  model: CanvasModel;

  constructor() {
    this.model = new CanvasModel();
    this.view = new CanvasView(this.model);
    this.stats = new StatsView(this.model);

    if (this.view.container) {
      this.view.container.addEventListener(
        "mousemove",
        this.mouseMove.bind(this)
      );
      this.view.container.addEventListener(
        "mousedown",
        this.mouseDown.bind(this)
      );
      this.view.container.addEventListener("mouseup", this.mouseUp.bind(this));
      this.view.container.addEventListener("wheel", this.mouseWheel.bind(this));
      document.addEventListener("keyup", this.keyUp.bind(this));
    }
  }

  mouseWheel(e: WheelEvent) {
    this.stats.render();
    this.view.draw();
  }

  mouseDown(e: Event): void {
    this.model.clicked = true;

    if (!this.model.mouse) return;

    let _mouse = new Vector(this.model.mouse.x, this.model.mouse.y);

    if (this.model.config.net.bind) {
      _mouse.x =
        Math.round(_mouse.x / this.model.config.net.step) *
        this.model.config.net.step;
      _mouse.y =
        Math.round(_mouse.y / this.model.config.net.step) *
        this.model.config.net.step;
    }

    switch (this.model.mode) {
      case "default":
        break;
      case "wall":
        break;
      case "pipe":
        this.pipeLaying(_mouse);
        break;
      case "valve":
        break;
    }

    this.stats.render();
    this.view.draw();
  }

  mouseMove(e: MouseEvent): void {
    if (!this.model.mouse) {
      this.model.mouse = {
        x: e.offsetX,
        y: e.offsetY,
      };
    } else {
      this.model.mouse.x = e.offsetX;
      this.model.mouse.y = e.offsetY;
    }

    let _mouse = new Vector(this.model.mouse.x, this.model.mouse.y);

    if (this.model.config.net.bind) {
      _mouse.x =
        Math.round(_mouse.x / this.model.config.net.step) *
        this.model.config.net.step;
      _mouse.y =
        Math.round(_mouse.y / this.model.config.net.step) *
        this.model.config.net.step;
    }

    this.actionModeUpdate(_mouse);

    this.stats.render();
    this.view.draw();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;
  }

  keyUp(e: KeyboardEvent) {
    console.log("e", e.code, e);
    if (e.key === "Escape") {
      console.log("----");
      this.model.actionMode = null; // Todo: future reset place here;
      this.reset();
    }
  }

  pipeLaying(coord: IVec) {
    let lastPipe = this.model.pipes[this.model.pipes.length - 1];

    if (!this.model.actionMode) {
      console.log("----");
      this.model.actionMode = "pipeLaying";

      let p = new Pipe(
        new Vector(coord.x, coord.y),
        new Vector(coord.x, coord.y)
      );
      p.temp = true;

      this.model.addPipe(p);
    } else {
      if (lastPipe) {
        lastPipe.temp = false;

        let p = new Pipe(lastPipe.end, coord);
        p.temp = true;
        this.model.addPipe(p);
      } else console.warn("something wrong");
    }
  }

  actionModeUpdate(_mouse: IVec) {
    switch (this.model.actionMode) {
      case "pipeLaying":
        let lastPipe = this.model.pipes[this.model.pipes.length - 1];
        lastPipe.end.x = _mouse.x;
        lastPipe.end.y = _mouse.y;

        console.log("lastPipe", lastPipe);
        break;
      case "wallLaying":
        break;
    }
  }

  reset() {
    this.model.pipes = this.model.pipes.filter((p) => !p.temp);

    this.stats.render();
    this.view.draw();
  }
}

export default Canvas;
