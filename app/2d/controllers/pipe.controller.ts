import CanvasModel from "../models/canvas.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel from "../models/heating/pipe.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove() {
    let coord = new Vector(
      this.model.netBoundMouse.x,
      this.model.netBoundMouse.y
    );

    if (
      this.model.actionObject &&
      this.model.actionObject instanceof PipeGhostModel
    ) {
      this.model.actionObject.to.vec.x = coord.x;
      this.model.actionObject.to.vec.y = coord.y;

      if (!this.model.actionObject.validation()) {
        document.body.style.cursor = "not-allowed";
      } else {
        document.body.style.cursor = "default";
      }
    }
  }

  mouseDown() {
    let coord = new Vector(
      this.model.netBoundMouse.x,
      this.model.netBoundMouse.y
    );

    if (!this.model.actionObject) {
      this.model.actionMode = "pipeLaying";
    }

    if (this.model.actionObject instanceof PipeGhostModel) {
      let pipe = new PipeModel(
        this.model,
        this.model.actionObject.from.vec.clone(),
        this.model.actionObject.to.vec.clone()
      );
      if (!this.model.actionObject.validation()) return;

      pipe.type = this.model.subMode ?? "supply";

      if (!pipe.validation()) throw new Error("Cant merge");

      pipe.update();
      this.model.addPipe(pipe);
    }

    this.model.actionObject = new PipeGhostModel(
      this.model,
      coord.clone(),
      coord.clone()
    );
  }

  mouseUp(coord: IVec) {}
}

export default Pipe;
