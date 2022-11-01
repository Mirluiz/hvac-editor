import CanvasModel from "../models/canvas.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel from "../models/heating/pipe.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove(c: IVec) {
    // let coord = this.model
    // if (
    //   this.model.actionObject &&
    //   this.model.actionObject instanceof PipeGhostModel
    // ) {
    //   this.model.actionObject.to.vec.x = coord.x;
    //   this.model.actionObject.to.vec.y = coord.y;
    // }
  }

  mouseDown(coord: IVec) {
    if (!this.model.actionObject) {
      this.model.actionMode = "pipeLaying";
    }

    if (this.model.actionObject instanceof PipeGhostModel) {
      let pipe = new PipeModel(
        this.model,
        this.model.actionObject.from.vec.clone(),
        this.model.actionObject.to.vec.clone()
      );
      pipe.type = this.model.subMode ?? "supply";
      this.model.addPipe(pipe);

      pipe.update(pipe);
    }

    this.model.actionObject = new PipeGhostModel(coord.clone(), coord.clone());
  }

  mouseUp(coord: IVec) {}
}

export default Pipe;
