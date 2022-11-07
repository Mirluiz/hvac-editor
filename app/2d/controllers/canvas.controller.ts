import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import { IVec, Vector } from "../../geometry/vect";
import PipeController from "./pipe.controller";
import Overlap from "../overlap.model";
import ObjectController from "./object.controller";

class Canvas {
  view: CanvasView;
  stats: StatsView;
  model: CanvasModel;
  pipe: PipeController;
  object: ObjectController;

  constructor() {
    this.model = new CanvasModel();
    this.view = new CanvasView(this.model);
    this.stats = new StatsView(this.model);

    this.pipe = new PipeController(this.model);
    this.object = new ObjectController(this.model);

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

    switch (this.model.mode) {
      case "default":
        break;
      case "wall":
        break;
      case "pipe":
        this.pipe.mouseDown();
        break;
      case "radiator":
      case "valve":
        this.object.mouseDown();
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

    this.model.overlap.update();

    switch (this.model.mode) {
      case "default":
        break;
      case "wall":
        break;
      case "pipe":
        this.pipe.mouseMove();
        break;
      case "radiator":
      case "valve":
        this.object.mouseMove();
        break;
    }

    this.stats.render();
    this.view.draw();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;

    if (!this.model.mouse) return;

    switch (this.model.mode) {
      case "default":
        break;
      case "wall":
        break;
      case "pipe":
        this.pipe.mouseUp();
        break;
      case "valve":
        this.object.mouseUp();
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

    document.body.style.cursor = "default";
    this.stats.render();
    this.view.draw();
  }
}

export default Canvas;
