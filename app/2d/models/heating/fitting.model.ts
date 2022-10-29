import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import Arc from "../geometry/arc.model";
import Pipe from "./pipe.model";
import CanvasModel from "../canvas.model";

class Fitting extends Arc {
  private _pipes: Array<Pipe> = [];
  model: CanvasModel;

  constructor(model: CanvasModel, center: IVec) {
    super(center);

    this.color = "black";
    this.model = model;
  }

  get pipes(): Array<Pipe> {
    return this._pipes;
  }

  set pipes(value: Array<Pipe>) {
    this._pipes = value;
  }

  needMerge(v: IVec) {
    let distance = this.model.config.overlap.bindDistance;

    return this.center.sub(v).length <= distance;
  }

  addPipe(pipe: Pipe) {
    this._pipes.push(pipe);
  }
}

export default Fitting;
