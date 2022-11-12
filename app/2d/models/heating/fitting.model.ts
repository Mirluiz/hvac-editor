import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import Arc from "../geometry/arc.model";
import Pipe from "./pipe.model";
import CanvasModel from "../canvas.model";

class Fitting extends Arc {
  private _pipes: Array<Pipe> = [];
  model: CanvasModel;
  width: number = 20;
  height: number = 20;

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

  get type(): "2d" | "3d" | "4d" | null {
    let ret: "2d" | "3d" | "4d" | null = null;

    if (this.pipes.length === 2) ret = "2d";
    if (this.pipes.length === 3) ret = "3d";
    if (this.pipes.length === 4) ret = "4d";

    return ret;
  }

  isClose(v: IVec) {
    let distance = this.model.config.overlap.bindDistance;

    return this.center.sub(v).length <= distance;
  }

  addPipe(pipe: Pipe) {
    this._pipes.push(pipe);
    this.pipes = this._pipes;

    return this.pipes[this.pipes.length - 1];
  }
}

export default Fitting;
