import CanvasModel from "../models/canvas.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel from "../models/heating/pipe.model";

class Pipe {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove() {}

  mouseDown(coord: IVec) {
    // this.model.update(coord);
  }

  mouseUp() {
    // let p = new PipeGhostModel(
    //   new Vector(coord.x, coord.y),
    //   new Vector(coord.x, coord.y)
    // );
    //
    // p.width = 5;
    //
    // this.model.addPipe(p);
  }
}

export default Pipe;
