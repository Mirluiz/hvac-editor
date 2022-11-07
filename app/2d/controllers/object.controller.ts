import CanvasModel from "../models/canvas.model";
import { ICoord, IVec, Vector } from "../../geometry/vect";
import ValveGhostModel from "../models/ghost/heating/valve.model";
import ValveModel from "../models/heating/valve.model";
import RadiatorGhostModel from "../models/ghost/heating/radiator.model";
import RadiatorModel from "../models/heating/radiator.model";
import { IOverlap } from "../overlap.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove() {
    if (!this.model.overlap.boundMouse) return;

    let bV = new Vector(
      this.model.overlap.boundMouse.x,
      this.model.overlap.boundMouse.y
    );

    if (
      this.model.placingObject &&
      this.model.placingObject instanceof ValveGhostModel
    ) {
      if (!this.model.overlap.isEmpty) {
        document.body.style.cursor = "default";
        let pipeFound = [
          ...this.model.overlap.list,
          ...this.model.overlap.boundList,
        ].find((o) => o.body);

        if (pipeFound?.body) {
        } else {
          document.body.style.cursor = "not-allowed";
        }
      } else {
        document.body.style.cursor = "not-allowed";
      }

      this.model.placingObject.center.x = bV.x;
      this.model.placingObject.center.y = bV.y;
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

  mouseUp() {}
}

export default Pipe;
