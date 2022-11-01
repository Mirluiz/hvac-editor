import { IVec, Vector } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import CanvasModel from "../canvas.model";
import Fitting from "./fitting.model";
import Valve from "./valve.model";

export type PipeTarget = null | Fitting | Valve;

export interface IPipeEnd {
  target: PipeTarget;
  vec: IVec;
  title: "from" | "to";
  getPipe: () => Pipe;
  getOpposite: () => IPipeEnd;
}

class Pipe extends Line<IPipeEnd> {
  type: "supply" | "return" = "supply";
  model: CanvasModel;
  constructor(model: CanvasModel, from: IVec, to: IVec) {
    super(
      {
        target: null,
        vec: from,
        title: "from",
        getPipe: () => {
          return this;
        },
        getOpposite: () => {
          return this.to;
        },
      },
      {
        target: null,
        vec: to,
        title: "to",
        getPipe: () => {
          return this;
        },
        getOpposite: () => {
          return this.from;
        },
      }
    );

    this.width = 10;
    this.model = model;
  }

  get color() {
    return this.type === "supply" ? "red" : "blue";
  }

  toOrigin(): IVec {
    return this.to.vec.sub(this.from.vec);
  }

  update(pipe: Pipe) {
    this.model.pipes.map((_pipe) => {
      if (_pipe.id === pipe.id) return;

      if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
        pipe.merge(_pipe);
      }
    });

    this.model.fittings.map((fitting) => {
      if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
        pipe.connect(fitting);
      }

      if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
        pipe.connect(fitting);
      }
    });
  }

  beforeMerge(pipe1: Pipe, pipe2: Pipe): boolean {
    let canMerge = false;

    let mergingVec: IPipeEnd | null = null;
    let angleBetween;

    [pipe1.from, pipe1.to, pipe2.from, pipe2.to].map((end) => {
      if (mergingVec) return;

      let overlaps = this.model.overlap.pipeOverlap(end.vec);
      overlaps = overlaps.filter((o) => o.id !== end.getPipe().id);
      if (overlaps.length > 0) {
        let overlap = overlaps[0];
        if (overlap && overlap.pipeEnd) {
          angleBetween = overlap.pipeEnd
            .getOpposite()
            .vec.sub(end.vec)
            .angle(end.getOpposite().vec.sub(end.vec));
        }
      }
    });

    if (
      angleBetween !== undefined &&
      Math.abs(angleBetween * (180 / Math.PI)) >= 90
    ) {
      canMerge = true;
    } else {
      console.warn("cant merge");
      // alert("Cant merge");
    }

    return canMerge;
  }

  afterMerge() {
    console.log("after merge");
  }

  merge(pipe: Pipe): boolean {
    let merged = false;

    if (!this.beforeMerge(pipe, this)) return false;

    const run = (end: IPipeEnd) => {
      if (this.id === pipe.id) return;

      let overlaps = this.model.overlap.pipeOverlap(end.vec);
      overlaps = overlaps.filter((o) => o.id !== end.getPipe().id);
      if (overlaps.length > 0) {
        let overlap = overlaps[0];
        if (overlap && overlap.pipeEnd) {
          if (overlap.pipeEnd.target) return;

          let newFitting = new Fitting(this.model, overlap.pipeEnd.vec);
          this.model.addFitting(newFitting);
          newFitting.addPipe(pipe);
          newFitting.addPipe(this);

          overlap.pipeEnd.target = newFitting;
          end.target = newFitting;
        } else if (overlap && overlap.pipe) {
          let mergePoint = overlap.pipe.vec.bindNet(this.model.config.net.step);

          let newP1 = new Pipe(
            this.model,
            new Vector(0, 0).sum(pipe.from.vec),
            new Vector(mergePoint.x, mergePoint.y)
          );

          let newP2 = new Pipe(
            this.model,
            new Vector(mergePoint.x, mergePoint.y),
            new Vector(pipe.to.vec.x, pipe.to.vec.y)
          );

          this.model.addPipe(newP1);
          this.model.addPipe(newP2);
          pipe.delete();

          let newFitting = new Fitting(this.model, mergePoint);
          this.model.addFitting(newFitting);

          newFitting.addPipe(newP1);
          newFitting.addPipe(newP2);

          newP1.from.target = pipe.from.target;
          newP1.to.target = newFitting;
          newP2.from.target = newFitting;
          newP2.to.target = pipe.to.target;

          merged = true;
        }
      }
    };

    if (!this.from.target) run(this.from);
    if (!this.to.target) run(this.to);

    this.afterMerge();

    return merged;
  }

  connect(target: PipeTarget) {
    let merged = false;

    if (target instanceof Fitting) {
      let isFrom = target.isClose(this.from.vec);
      let isTo = target.isClose(this.to.vec);

      if (isFrom || isTo) {
        target.addPipe(this);
        merged = true;
      }

      if (isFrom) {
        this.from.target = target;
      } else if (isTo) this.to.target = target;

      return merged;
    }

    return merged;
  }

  isClose(end: IVec) {
    let distance = this.model.config.overlap.bindDistance;

    return (
      this.from.vec.sub(end).length <= distance ||
      this.to.vec.sub(end).length <= distance ||
      end.distanceToLine(this) <= distance
    );
  }

  delete() {
    this.model.pipes = this.model.pipes.filter((_p) => _p.id !== this.id);
  }
}

export default Pipe;
