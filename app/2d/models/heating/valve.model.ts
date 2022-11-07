import { IVec, Vector } from "../../../geometry/vect";
import Arc from "../geometry/arc.model";
import Pipe from "./pipe.model";
import CanvasModel from "../canvas.model";

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

  beforeMerge() {
    return true;
  }

  merge(): boolean {
    let merged = false;

    if (!this.beforeMerge()) return false;

    let overlaps = this.model.overlap.pipeOverlap(this.center);
    overlaps = overlaps.filter((o) => o.id !== this.id);

    overlaps.map((overlap) => {
      if (overlap.pipe) {
        let mergePoint = overlap.pipe.vec.bindNet(this.model.config.net.step);

        let newP1 = new Pipe(
          this.model,
          overlap.pipe.object.from.vec.clone(),
          new Vector(mergePoint.x, mergePoint.y)
        );

        let newP2 = new Pipe(
          this.model,
          new Vector(mergePoint.x, mergePoint.y),
          overlap.pipe.object.to.vec.clone()
        );

        this.model.addPipe(newP1);
        this.model.addPipe(newP2);
        overlap.pipe.object.delete();

        let newValve = new Valve(this.model, mergePoint);
        this.model.addValve(newValve);

        newValve.addPipe(newP1);
        newValve.addPipe(newP2);

        newP1.from.target = overlap.pipe.object.from.target;
        newP1.to.target = { id: newValve.id, object: newValve };
        newP2.from.target = { id: newValve.id, object: newValve };
        newP2.to.target = overlap.pipe.object.to.target;

        merged = true;
      }
    });

    this.afterMerge();

    return merged;
  }

  afterMerge() {}

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

export default Valve;
