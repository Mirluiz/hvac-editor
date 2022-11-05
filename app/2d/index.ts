import CanvasController from "./controllers/canvas.controller";
import Toolbar from "./controllers/toolbar.controller";
import StatsView from "./views/stats.view";

class Controller {
  canvas: CanvasController = new CanvasController();

  toolbar: Toolbar;

  constructor() {
    this.toolbar = new Toolbar(this.canvas.model);
    this.canvas.model.update();
  }
}

export default Controller;
