import CanvasModel from "../../2d/models/canvas.model";
import { ToolbarMenu, ToolbarMode } from "../controller/toolbar.controller";

class InfoPanel {
  model: {};
  container: HTMLElement | null;

  constructor(model: {}) {
    this.model = model;
    this.container = document.querySelector(".infoPanel");
  }

  render() {}
}

export default InfoPanel;
