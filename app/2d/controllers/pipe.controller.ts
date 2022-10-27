import CanvasModel from "../models/canvas.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel from "../models/heating/pipe.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove(coord: IVec) {
    if (
      this.model.actionObject &&
      this.model.actionObject instanceof PipeGhostModel
    ) {
      this.model.actionObject.end.x = coord.x;
      this.model.actionObject.end.y = coord.y;
    }
  }

  mouseDown(coord: IVec) {
    if (!this.model.actionObject) {
      this.model.actionMode = "pipeLaying";
    }

    if (this.model.actionObject instanceof PipeGhostModel) {
      let pipe = new PipeModel(
        this.model.actionObject.start.clone(),
        this.model.actionObject.end.clone()
      );
      this.model.addPipe(pipe);
      this.model.mergeController(pipe, pipe.start);
    }

    let ghostP = new PipeGhostModel(coord.clone(), coord.clone());
    this.model.actionObject = ghostP;
  }

  mouseUp(coord: IVec) {}
}

export default Pipe;
