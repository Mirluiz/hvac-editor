import CanvasModel from "../models/canvas.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel, { PipeTarget } from "../models/heating/pipe.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove() {
    let v = this.model.getWorldCoordinates(
      this.model.mouse.x,
      this.model.mouse.y
    );

    v = v.bindNet(this.model.config.net.step);

    if (
      this.model.actionObject &&
      this.model.actionObject instanceof PipeGhostModel
    ) {
      let target: null | PipeTarget = null;

      for (let overlap of [
        ...this.model.overlap.list,
        ...this.model.overlap.boundList,
      ]) {
        if (overlap.io) {
          target = {
            id: overlap.id,
            io: overlap.io,
            object: overlap.io.getRadiator(),
          };
        }
      }

      if (target?.io) {
        this.model.actionObject.to.target = target;
        this.model.actionObject.to.vec.x = target.io.getVecAbs().x;
        this.model.actionObject.to.vec.y = target.io.getVecAbs().y;
      } else {
        this.model.actionObject.to.target = null;
        this.model.actionObject.to.vec.x = v.x;
        this.model.actionObject.to.vec.y = v.y;
      }

      if (!this.model.actionObject.validation()) {
        document.body.style.cursor = "not-allowed";
      } else {
        document.body.style.cursor = "default";
      }
    }
  }

  mouseDown() {
    let coord = this.model.getWorldCoordinates(
      this.model.mouse.x,
      this.model.mouse.y
    );

    coord = coord.bindNet(this.model.config.net.step);

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
