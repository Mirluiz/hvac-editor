import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import ModeView from "../views/mode.view";
import Wall from "../models/wall.model";

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

    if (this.model.actionMode === "wall") {
      if (!this.model.actionObject) {
        let _mouse = { x: this.model.mouse.x, y: this.model.mouse.y };

        if (this.model.config.net.bind) {
          _mouse.x =
            Math.round(_mouse.x / this.model.config.net.step) *
            this.model.config.net.step;
          _mouse.y =
            Math.round(_mouse.y / this.model.config.net.step) *
            this.model.config.net.step;
        }

        this.model.actionObject = this.model.addWall(
          {
            x: _mouse.x,
            y: _mouse.y,
          },
          {
            x: _mouse.x,
            y: _mouse.y,
          }
        );
      } else {
        this.model.actionObject = null;
      }
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
      if (this.model.actionObject instanceof Wall) {
        let _mouse = { x: this.model.mouse.x, y: this.model.mouse.y };

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
