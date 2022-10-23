import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";

class CanvasController {
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
    let scale = this.model.scale.amount + -Math.sign(e.deltaY) * 0.1;
    scale = Math.min(Math.max(0.5, scale), 2);

    this.model.scale.limitReached =
      Math.abs(scale - 0.5) < Number.EPSILON ||
      Math.abs(scale - 2) < Number.EPSILON;

    if (!this.model.scale.limitReached) {
      this.model.scale.amount = scale;

      let _el: HTMLCanvasElement | null = document.querySelector("#editor");

      if (_el) {
        let w = _el.width,
          h = _el.height;

        let mltpr = 0.1;

        this.model.offset.x +=
          w *
          (Math.sign(e.deltaY) * mltpr) *
          ((e.offsetX - this.model.offset.x) / _el.width);
        this.model.offset.y +=
          h *
          (Math.sign(e.deltaY) * mltpr) *
          ((e.offsetY - this.model.offset.y) / _el.height);
      }
    }

    this.stats.render();
    this.view.draw();
  }

  mouseDown(e: Event): void {
    this.model.clicked = true;
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

    this.stats.render();
    this.view.draw();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;
  }
}

export default CanvasController;
