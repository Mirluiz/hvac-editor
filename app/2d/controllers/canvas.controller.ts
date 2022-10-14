import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";

class CanvasController {
  view: CanvasView;
  model: CanvasModel;

  constructor() {
    this.model = new CanvasModel();
    this.view = new CanvasView(this.model);
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
    this.model.scale.amount += -Math.sign(e.deltaY) * 0.01;
    this.model.scale.amount = Math.min(
      Math.max(0.5, this.model.scale.amount),
      4
    );
    this.model.scale.coord = {
      x: e.offsetX,
      y: e.offsetY,
    };

    let _el: HTMLCanvasElement | null = document.querySelector("#editor");
    let w, h;

    if (_el) {
      w = _el.width;
      h = _el.height;
      console.log(
        "--",
        w,
        w / this.model.scale.amount,
        this.model.scale.amount,
        (w / this.model.scale.amount - w) * (e.offsetX / w)
      );
      this.model.offset.x +=
        (w / this.model.scale.amount - w) * (e.offsetX / w);
      this.model.offset.y +=
        (h / this.model.scale.amount - h) * (e.offsetY / h);
    }

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

    this.view.draw();
  }

  mouseUp(e: Event) {
    this.model.clicked = false;
  }
}

export default CanvasController;
