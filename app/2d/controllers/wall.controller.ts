import CanvasModel from "../models/canvas.model";
import { IVec, Vector } from "../../geometry/vect";
import PipeGhostModel from "../models/ghost/heating/pipe.model";
import PipeModel, { PipeTarget } from "../models/heating/pipe.model";
import Fitting from "../models/heating/fitting.model";

class Wall {
  model: CanvasModel;

  constructor(model: CanvasModel) {
    this.model = model;
  }

  mouseMove() {}

  mouseDown() {}

  mouseUp() {}
}

export default Wall;
