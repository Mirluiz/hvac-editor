import { IVec, Vector } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import CanvasModel from "../canvas.model";
import Fitting from "./fitting.model";
import Valve from "./valve.model";
import Radiator, { IO } from "./radiator.model";
import { IOverlapBody } from "../../overlap.model";

export type PipeTarget = null | {
  id: string;
  object?: Fitting | Valve | Radiator;
  end?: IPipeEnd;
  body?: IOverlapBody<Pipe>;
  io?: IO<Radiator>;
};

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

  update() {
    this.model.pipes.map((_pipe) => {
      if (_pipe.id === this.id) return;

      if (_pipe.isClose(this.from.vec) || _pipe.isClose(this.to.vec)) {
        this.merge(_pipe);
      }
    });

    this.model.fittings.map((fitting) => {
      if (fitting.isClose(this.from.vec) && !this.from.target) {
        this.connect(fitting);
      }

      if (fitting.isClose(this.to.vec) && !this.to.target) {
        this.connect(fitting);
      }
    });
  }

  validation() {
    let can = true;

    [this.from, this.to].map((end) => {
      let overlaps = this.model.overlap.pipeOverlap(end.vec);
      overlaps = overlaps.filter((o) => o.id !== this.id);
      if (overlaps.length > 0) {
        let overlap = overlaps[0];
        let angleBetween;
        if (overlap && overlap.pipeEnd) {
          angleBetween = overlap.pipeEnd
            .getOpposite()
            .vec.sub(end.vec)
            .angle(end.getOpposite().vec.sub(end.vec));
          if (
            angleBetween !== undefined &&
            Math.abs(angleBetween * (180 / Math.PI)) < 90
          ) {
            can = false;
          }
        } else if (overlap && overlap.body) {
          can = true;
        } else {
          can = false;
        }
      }
    });

    if (!can) {
      console.warn("Cant merge");
    }

    return can;
  }

  beforeMerge() {
    console.log("before merge");

    return this.validation();
  }

  afterMerge() {
    console.log("after merge");
  }

  merge(pipe: Pipe): boolean {
    let merged = false;

    if (!this.beforeMerge()) return false;

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
          newFitting.addPipe(overlap.pipeEnd.getPipe());
          newFitting.addPipe(end.getPipe());

          overlap.pipeEnd.target = { id: newFitting.id, object: newFitting };
          end.target = { id: newFitting.id, object: newFitting };
        } else if (overlap && overlap.body) {
          let mergePoint = overlap.body.vec.bindNet(this.model.config.net.step);

          let newP1 = new Pipe(
            this.model,
            overlap.body.object.from.vec.clone(),
            new Vector(mergePoint.x, mergePoint.y)
          );

          let newP2 = new Pipe(
            this.model,
            new Vector(mergePoint.x, mergePoint.y),
            overlap.body.object.to.vec.clone()
          );

          this.model.addPipe(newP1);
          this.model.addPipe(newP2);
          overlap.body.object.delete();

          let newFitting = new Fitting(this.model, mergePoint);
          this.model.addFitting(newFitting);

          newFitting.addPipe(newP1);
          newFitting.addPipe(newP2);

          newP1.from.target = pipe.from.target;
          newP1.to.target = { id: newFitting.id, object: newFitting };
          newP2.from.target = { id: newFitting.id, object: newFitting };
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

  connect(target: Fitting | Valve | Radiator | IO<Radiator>) {
    let merged = false;

    if (target instanceof Fitting) {
      let isFrom = target.isClose(this.from.vec);
      let isTo = target.isClose(this.to.vec);

      if (isFrom || isTo) {
        target.addPipe(this);
        merged = true;
      }

      if (isFrom) {
        this.from.target = { id: target.id, object: target };
      } else if (isTo) this.to.target = { id: target.id, object: target };

      return merged;
    }

    if (target && "getRadiator" in target) {
      let isFrom = target.getVecAbs().sub(this.from.vec).length <= 20;
      let isTo = target.getVecAbs().sub(this.to.vec).length <= 20;

      if (isFrom || isTo) {
        merged = true;
      }

      if (isFrom) {
        this.from.target = {
          id: target.getRadiator().id,
          object: target.getRadiator(),
          io: target,
        };
      } else if (isTo)
        this.to.target = {
          id: target.getRadiator().id,
          object: target.getRadiator(),
          io: target,
        };

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
