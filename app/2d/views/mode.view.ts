import CanvasModel from "../models/canvas.model";

class Mode {
  model: CanvasModel;
  container: HTMLElement | null;
  subContainer: HTMLElement | null;

  constructor(model: CanvasModel) {
    this.model = model;
    this.container = document.querySelector("#mode");
    this.subContainer = document.querySelector("#subMode");
  }
}

export default Mode;
