import { IVec, Vector } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import CanvasModel from "../canvas.model";
import Fitting from "./fitting.model";
import Valve from "./valve.model";

interface IPipeEnd {
  target: null | Fitting | Valve;
  vec: IVec;
}

class Pipe extends Line<IPipeEnd> {
  type: "supply" | "return" = "supply";
  model: CanvasModel;

  constructor(model: CanvasModel, from: IVec, to: IVec) {
    super({ target: null, vec: from }, { target: null, vec: to });

    this.model = model;
  }

  get color() {
    return this.type === "supply" ? "red" : "blue";
  }

  toOrigin(): IVec {
    return this.to.vec.sub(this.from.vec);
  }

  merge() {
    let merged = false;

    this.model.fittings.map((fitting) => {
      if (fitting.needMerge(this.from.vec) || fitting.needMerge(this.to.vec)) {
        merged = this.mergeFitting(fitting);
      }
    });

    this.model.pipes.map((pipe) => {
      if (this.id === pipe.id) return;

      if (pipe.isClose(this.from.vec) || pipe.isClose(this.to.vec)) {
        merged = this.mergePipe(pipe);
      }
    });
  }

  mergePipe(pipe: Pipe): boolean {
    let distance = this.model.config.overlap.bindDistance;
    let merged = false;

    const run = (end: IPipeEnd) => {
      if (this.id === pipe.id) return;

      if (pipe.isClose(end.vec)) {
        let mergePoint;

        if (pipe.from.vec.sub(end.vec).length <= distance) {
          if (pipe.from.target) return;

          mergePoint = pipe.from.vec.clone();

          let newFitting = new Fitting(this.model, mergePoint);
          this.model.addFitting(newFitting);

          pipe.from.target = newFitting;
          end.target = newFitting;

          return;
        } else if (pipe.to.vec.sub(end.vec).length <= distance) {
          if (pipe.to.target) return;

          mergePoint = pipe.to.vec.clone();

          let newFitting = new Fitting(this.model, mergePoint);
          this.model.addFitting(newFitting);

          pipe.to.target = newFitting;
          end.target = newFitting;

          return;
        }

        let normPipe = pipe.toOrigin().normalize();
        let projPipe = pipe.toOrigin().projection(end.vec.sub(pipe.from.vec));

        mergePoint = normPipe.multiply(projPipe).sum(pipe.from.vec);
        mergePoint = mergePoint.bindNet(this.model.config.net.step);

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

        // end = mergePoint.clone();
        this.model.addPipe(newP1);
        this.model.addPipe(newP2);
        pipe.delete();

        let newFitting = new Fitting(this.model, mergePoint);
        this.model.addFitting(newFitting);

        newP1.from.target = pipe.from.target;
        newP1.to.target = newFitting;
        newP2.from.target = newFitting;
        newP2.to.target = pipe.to.target;

        merged = true;
      }
    };

    run(this.from);
    run(this.to);
    console.log("from", this.from);
    console.log("to", this.to);

    return merged;
  }

  mergeFitting(fitting: Fitting): boolean {
    let merged = false;

    let isFrom = fitting.needMerge(this.from.vec);
    let isTo = fitting.needMerge(this.to.vec);

    if (isFrom || isTo) {
      fitting.pipes.push(this);
      merged = true;
    }

    if (isFrom) {
      this.from.target = fitting;
    } else if (isTo) this.to.target = fitting;

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
