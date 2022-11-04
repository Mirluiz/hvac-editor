import { IVec, Vector } from "../../../../geometry/vect";
import CanvasModel from "../../canvas.model";
import Arc from "../../geometry/arc.model";
import overlapModel from "../../../overlap.model";
import Pipe from "../../heating/pipe.model";

class Valve extends Arc {
  private _pipes: Array<Pipe> = [];
  model: CanvasModel;
  width: number = 10;
  length: number = 20;

  constructor(model: CanvasModel, center: IVec) {
    super(center);

    this.model = model;
  }

  get pipes(): Array<Pipe> {
    return this._pipes;
  }

  set pipes(value: Array<Pipe>) {
    this._pipes = value;
  }

  validation(): boolean {
    let overlaps = this.model.overlap.pipeOverlap(this.center);

    return overlaps.length > 0 && Boolean(overlaps.find((o) => o.pipe));
  }

  addPipe(pipe: Pipe) {
    this._pipes.push(pipe);
    this.pipes = this._pipes;

    return this.pipes[this.pipes.length - 1];
  }
}

export default Valve;
