import CanvasController from "./controllers/canvas.controller";
import Toolbar from "../ui/controller/toolbar.controller";
import StatsView from "./views/stats.view";
import InfoPanel from "../ui/controller/info-panel.controller";

class Controller {
  canvas: CanvasController = new CanvasController();

  toolbar: Toolbar;
  infoPanel: InfoPanel;

  constructor() {
    this.toolbar = new Toolbar(this.canvas.model);
    this.infoPanel = new InfoPanel(this.canvas.model);
    this.canvas.model.update();
  }
}

export default Controller;
