import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import Wall from "../models/architecture/wall.model";
import Pipe from "../models/heating/pipe.model";
import Line from "../models/geometry/line.model";
import Valve from "../models/heating/valve.model";
import { Vector } from "../../geometry/vect";
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

    if (!this.model.actionObject) {
      if (this.model.config.net.bind) {
        _mouse.x =
          Math.round(_mouse.x / this.model.config.net.step) *
          this.model.config.net.step;
        _mouse.y =
          Math.round(_mouse.y / this.model.config.net.step) *
          this.model.config.net.step;
      }

      switch (this.model.actionMode) {
        case "wall":
          this.model.actionObject = this.model.addWall(
            new Vector(_mouse.x, _mouse.y),
            new Vector(_mouse.x, _mouse.y)
          );
          break;
        case "pipe":
          this.model.actionObject = new Pipe(
            new Vector(_mouse.x, _mouse.y),
            new Vector(_mouse.x, _mouse.y)
          );
          break;
      }
    } else {
      switch (this.model.actionMode) {
        case "wall":
          this.model.addWall(
            this.model.actionObject.start,
            this.model.actionObject.end
          );
          break;
        case "pipe":
          this.model.addPipe(
            this.model.actionObject.start,
            this.model.actionObject.end
          );
          break;
      }

      this.model.actionObject = null;
    }

    if (!this.model.placingObject) {
      if (this.model.config.net.bind) {
        _mouse.x =
          Math.round(_mouse.x / this.model.config.net.step) *
          this.model.config.net.step;
        _mouse.y =
          Math.round(_mouse.y / this.model.config.net.step) *
          this.model.config.net.step;
      }

      switch (this.model.actionMode) {
        case "valve":
          this.model.placingObject = new Valve(new Vector(_mouse.x, _mouse.y));
          break;
      }
    } else {
      switch (this.model.actionMode) {
        case "valve":
          this.model.addValve(this.model.placingObject.center);
          break;
      }

      this.model.actionObject = null;
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

    if (this.model.actionObject) {
      if (this.model.actionObject instanceof Pipe) {
        let _mouse = new Vector(this.model.mouse.x, this.model.mouse.y);

        if (this.model.config.net.bind) {
          _mouse.x =
            Math.round(_mouse.x / this.model.config.net.step) *
            this.model.config.net.step;
          _mouse.y =
            Math.round(_mouse.y / this.model.config.net.step) *
            this.model.config.net.step;
        }
        this.model.actionObject.end.x = _mouse.x;
        this.model.actionObject.end.y = _mouse.y;

        this.model.actionObject.getNearestCoordinateOnPipe(
          new Vector(this.model.mouse.x, this.model.mouse.y),
          this.model.pipes[0]
        );
      }
    }

    if (this.model.placingObject) {
      if (this.model.placingObject instanceof Valve) {
        let _mouse = new Vector(this.model.mouse.x, this.model.mouse.y);

        if (this.model.config.net.bind) {
          _mouse.x =
            Math.round(_mouse.x / this.model.config.net.step) *
            this.model.config.net.step;
          _mouse.y =
            Math.round(_mouse.y / this.model.config.net.step) *
            this.model.config.net.step;
        }
        this.model.placingObject.center.x = _mouse.x;
        this.model.placingObject.center.y = _mouse.y;
      }
    }

    this.stats.render();
    this.view.draw();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;
  }
}

export default Canvas;
