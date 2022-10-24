import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import ModeView from "../views/mode.view";

class Mode {
  view: ModeView;
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
    this.view = new ModeView(this.model);

    console.log(this.view);

    if (this.view.container) {
      this.view.container.addEventListener("click", this.mouseDown.bind(this));
    }
  }

  mouseDown(e: Event) {
    let cT = e.target as HTMLInputElement;
    let value = cT.value;

    if (value === "default" || value === "wall" || value === "pipe") {
      this.model.actionMode = value;
    }
  }
}

export default Mode;
