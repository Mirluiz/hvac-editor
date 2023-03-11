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
    // e.preventDefault();
    //
    // let preZoom;
    // let afterZoom;
    //
    // if (this.model.canvasSize) {
    //   preZoom = {
    //     x: this.model.canvasSize.x / this.model.scale.amount,
    //     y: this.model.canvasSize.y / this.model.scale.amount,
    //   };
    // }
    //
    // this.model.scale.amount += -Math.sign(e.deltaY) * 0.1;
    // this.model.scale.amount =
    //   Math.round(Math.min(Math.max(0.5, this.model.scale.amount), 2) * 100) /
    //   100;
    //
    // // let newZoom = this.model.scale.amount * Math.pow(2, e.deltaY * -0.1);
    // // this.model.scale.amount = Math.min(Math.max(0.5, newZoom), 2);
    //
    // if (this.model.canvasSize) {
    //   afterZoom = {
    //     x: this.model.canvasSize.x / this.model.scale.amount,
    //     y: this.model.canvasSize.y / this.model.scale.amount,
    //   };
    // }
    //
    // if (this.model.scale.coord) {
    //   this.model.scale.coord.x = e.offsetX;
    //   this.model.scale.coord.y = e.offsetY;
    // } else {
    //   this.model.scale.coord = { x: e.offsetX, y: e.offsetY, z: 0 };
    // }
    //
    // let limitReached =
    //   Math.abs(this.model.scale.amount - 0.5) < Number.EPSILON ||
    //   Math.abs(this.model.scale.amount - 2) < Number.EPSILON;
    //
    // if (limitReached) return;
    //
    // if (
    //   preZoom &&
    //   afterZoom &&
    //   this.model.canvasSize &&
    //   this.model.scale.coord
    // ) {
    //   let ratioX =
    //     Math.round((this.model.scale.coord.x / this.model.canvasSize.x) * 100) /
    //     100;
    //   let ratioY =
    //     Math.round((this.model.scale.coord.y / this.model.canvasSize.y) * 100) /
    //     100;
    //   this.model.offset.x +=
    //     Math.sign(e.deltaY) * (this.model.canvasSize.x * 0.1) * ratioX;
    //   this.model.offset.y +=
    //     Math.sign(e.deltaY) * (this.model.canvasSize.y * 0.1) * ratioY;
    // }
  }

  uF() {
    let preZoom;
    let afterZoom;

    // this.model.scale.amount = 1;

    if (this.model.canvasSize) {
      preZoom = {
        x: this.model.canvasSize.x / this.model.scale.amount,
        y: this.model.canvasSize.y / this.model.scale.amount,
      };
    }

    this.model.scale.amount = this.model.scale.amount - 0.1;
    // this.model.scale.amount = 0.8;

    if (this.model.canvasSize) {
      afterZoom = {
        x: this.model.canvasSize.x / this.model.scale.amount,
        y: this.model.canvasSize.y / this.model.scale.amount,
      };
    }

    if (preZoom && afterZoom && this.model.canvasSize) {
      this.model.offset.x += this.model.canvasSize.x * 0.1 * 0.14;
      // (afterZoom.x - preZoom.x) * 0.5 * this.model.scale.amount;
      this.model.offset.y += this.model.canvasSize.y * 0.1 * 0.14;
      // (afterZoom.y - preZoom.y) * 0.5 * this.model.scale.amount;

      console.log("");
      console.log("amount", this.model.scale.amount);
      console.log("diff", afterZoom.x - preZoom.x);
      console.log(
        "diff result",
        (afterZoom.x - preZoom.x) * 0.5 * this.model.scale.amount,
        (afterZoom.y - preZoom.y) * 0.5 * this.model.scale.amount
      );
      console.log("");
    }
  }

  mouseDown(e: MouseEvent): void {
    if (e.button === 1) {
      this.model.wheelClicked = true;
      return;
    } else {
      this.model.wheelClicked = false;
      this.model.clicked = true;
    }

    if (!this.model.mouse) return;

    switch (this.model.mode) {
      case "default":
        break;
      case "wall":
        break;
      case "pipe":
        this.pipe.mouseDown();
        this.view.update();
        break;
      case "radiator":
      case "valve":
        this.object.mouseDown();
        break;
    }

    // this.stats.render();
    // this.view.draw();
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

    if (
      this.model.wheelClicked ||
      (this.model.mode === "default" && this.model.clicked)
    ) {
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

    // this.stats.render();
    // this.view.update();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;
    this.model.wheelClicked = false;

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
    // this.stats.render();
    // this.view.draw();
  }
}

export default Canvas;
