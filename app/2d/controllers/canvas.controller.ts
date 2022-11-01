import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import { IVec, Vector } from "../../geometry/vect";
import PipeController from "./pipe.controller";
import Overlap from "../overlap.model";

class Canvas {
  view: CanvasView;
  stats: StatsView;
  model: CanvasModel;
  pipe: PipeController;

  constructor() {
    this.model = new CanvasModel();
    this.view = new CanvasView(this.model);
    this.stats = new StatsView(this.model);

    this.pipe = new PipeController(this.model);

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

    let worldCoord = this.model.getWorldCoordinates(
      this.model.mouse.x,
      this.model.mouse.y
    );
    let _mouse = new Vector(worldCoord.x, worldCoord.y);

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
        this.pipe.mouseDown(_mouse);
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

    if (this.model.clicked) {
      if (this.model.offset) {
        this.model.offset.x += e.movementX;
        this.model.offset.y += e.movementY;
      } else {
        this.model.offset = {
          x: 0,
          y: 0,
        };
      }
    }

    let worldCoord = this.model.getWorldCoordinates(
      this.model.mouse.x,
      this.model.mouse.y
    );

    let _mouse = new Vector(worldCoord.x, worldCoord.y);

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
        this.pipe.mouseMove(_mouse);
        break;
      case "valve":
        break;
    }

    this.model.overlap.update(_mouse);

    this.stats.render();
    this.view.draw();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;

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
        this.pipe.mouseUp(_mouse);
        break;
      case "valve":
        break;
    }
  }

  keyUp(e: KeyboardEvent) {
    if (e.key === "Escape") {
      this.model.actionMode = null; // Todo: future reset place here;
      this.reset();
    }
  }

  reset() {
    this.model.actionObject = null;

    this.stats.render();
    this.view.draw();
  }
}

export default Canvas;
