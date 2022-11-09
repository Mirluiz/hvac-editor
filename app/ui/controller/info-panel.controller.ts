import CanvasModel from "../../2d/models/canvas.model";
import InfoPanelView from "../view/info-panel.view";

class InfoPanel {
  view: InfoPanelView;
  model: CanvasModel;
  panelModel: {} = {};

  constructor(model: CanvasModel) {
    this.model = model;
    this.view = new InfoPanelView(this.panelModel);
  }
}

export default InfoPanel;
