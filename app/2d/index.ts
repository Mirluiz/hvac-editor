import CanvasController from "./controllers/canvas.controller";
import ModeController from "./controllers/mode.controller";
import StatsView from "./views/stats.view";

class Controller {
  canvas: CanvasController = new CanvasController();

  mode: ModeController;

  constructor() {
    this.mode = new ModeController(this.canvas.model);
  }
}

export default Controller;
