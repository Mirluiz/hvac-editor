import CanvasModel from "../models/canvas.model";
import { IVec } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel from "../models/heating/pipe.model";
import ValveGhostModel from "../models/ghost/heating/valve.model";
import ValveModel from "../models/heating/valve.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove(coord: IVec) {
    if (
      this.model.placingObject &&
      this.model.placingObject instanceof ValveGhostModel
    ) {
      this.model.placingObject.center.x = coord.x;
      this.model.placingObject.center.y = coord.y;

      // if (!this.model.placingObject.validation()) {
      //   document.body.style.cursor = "not-allowed";
      // } else {
      //   document.body.style.cursor = "default";
      // }
    }
  }

  mouseDown(coord: IVec) {
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
  }

  mouseUp(coord: IVec) {}
}

export default Pipe;
