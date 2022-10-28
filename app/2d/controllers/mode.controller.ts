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

    if (this.view.container) {
      this.view.container.addEventListener("click", this.handleMode.bind(this));
    }

    if (this.view.subContainer) {
      this.view.subContainer.addEventListener(
        "click",
        this.handleSubMode.bind(this)
      );
    }
  }

  handleMode(e: Event) {
    let cT = e.target as HTMLInputElement;
    let value = cT.value;

    if (
      value === "default" ||
      value === "wall" ||
      value === "pipe" ||
      value === "valve"
    ) {
      this.model.mode = value;
    }
  }

  handleSubMode(e: Event) {
    let cT = e.target as HTMLInputElement;
    let value = cT.value;

    if (value === "supply" || value === "return") {
      this.model.subMode = value;
    }
  }
}

export default Mode;
