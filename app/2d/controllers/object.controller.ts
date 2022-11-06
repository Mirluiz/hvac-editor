import CanvasModel from "../models/canvas.model";
import { ICoord, IVec, Vector } from "../../geometry/vect";
import ValveGhostModel from "../models/ghost/heating/valve.model";
import ValveModel from "../models/heating/valve.model";
import RadiatorGhostModel from "../models/ghost/heating/radiator.model";
import RadiatorModel from "../models/heating/radiator.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove() {
    let bV = new Vector(this.model.netBoundMouse.x, this.model.netBoundMouse.y);
    let v = new Vector(this.model.mouse.x, this.model.mouse.y);

    v = v.bindNet(this.model.config.net.step);
    bV = bV.bindNet(this.model.config.net.step);

    if (
      this.model.placingObject &&
      this.model.placingObject instanceof ValveGhostModel
    ) {
      let overlaps = this.model.overlap.pipeOverlap(v);
      let pipeFound: IVec | null = null;
      this.model.placingObject.pipes = [];

      for (let overlap of overlaps) {
        if (overlap.pipe) {
          pipeFound = new Vector(overlap.pipe.vec.x, overlap.pipe.vec.y);
          break;
        }
      }

      if (pipeFound) {
        document.body.style.cursor = "default";
        this.model.placingObject.center.x = pipeFound.x;
        this.model.placingObject.center.y = pipeFound.y;
      } else {
        this.model.placingObject.center.x = bV.x;
        this.model.placingObject.center.y = bV.y;
        document.body.style.cursor = "not-allowed";
      }
    }

    if (
      this.model.placingObject &&
      this.model.placingObject instanceof RadiatorGhostModel
    ) {
      this.model.placingObject.center.x = bV.x;
      this.model.placingObject.center.y = bV.y;
    }
  }

  mouseDown() {
    if (this.model.placingObject instanceof ValveGhostModel) {
      if (!this.model.placingObject.validation()) {
        console.log("Validation error");
        return;
      }

      let valve = new ValveModel(
        this.model,
        this.model.placingObject.center.clone()
      );

      valve.merge();
    }

    if (this.model.placingObject instanceof RadiatorGhostModel) {
      if (!this.model.placingObject.validation()) {
        console.log("Validation error");
        return;
      }

      let radiator = new RadiatorModel(
        this.model,
        this.model.placingObject.center.clone()
      );

      radiator.merge();

      this.model.addRadiator(radiator);
    }
  }

  mouseUp(coord: IVec) {}
}

export default Pipe;
