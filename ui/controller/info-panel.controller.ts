import CanvasModel from "../../app/2d/models/canvas.model";
import InfoPanelView from "../view/info-panel.view";

class InfoPanel {
  view: InfoPanelView;
  model: CanvasModel;
  panelModel: {} = {};

  constructor(model: CanvasModel) {
    this.model = model;
    this.view = new InfoPanelView(this.panelModel);

    if (this.view.pipeModeFrame) {
      this.view.pipeModeFrame.addEventListener(
        "click",
        this.pipeModeHandle.bind(this)
      );
    }

    if (this.view.pipeType) {
      this.view.pipeType.forEach((e) => {
        e.addEventListener("change", this.pipeTypeHandle.bind(this));
      });
    }
  }

  pipeModeHandle() {}
  pipeTypeHandle(e: Event) {
    let cT = e.currentTarget as HTMLInputElement;
    let value = cT.value;

    if (value === "supply" || value === "return") {
      this.model.updateSubMode(value);
    }
  }
}

export default InfoPanel;
