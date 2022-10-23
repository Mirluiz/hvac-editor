import CanvasModel from "../models/canvas.model";

class Mode {
  model: CanvasModel;
  container: HTMLElement | null;

  constructor(model: CanvasModel) {
    this.model = model;
    this.container = document.querySelector("#mode");
  }
}

export default Mode;
