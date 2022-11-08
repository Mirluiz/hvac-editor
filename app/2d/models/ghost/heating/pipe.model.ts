import Line from "../../geometry/line.model";
import { IVec } from "../../../../geometry/vect";
import CanvasModel from "../../canvas.model";
import { PipeTarget } from "../../heating/pipe.model";
import Fitting from "../../heating/fitting.model";

interface IGhostPipeEnd {
  target: PipeTarget;
  vec: IVec;
  getPipe: () => Pipe;
  getOpposite: () => IGhostPipeEnd;
}

class Pipe extends Line<IGhostPipeEnd> {
  model: CanvasModel;

  constructor(model: CanvasModel, from: IVec, to: IVec) {
    super(
      {
        target: null,
        vec: from,
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
        getPipe: () => {
          return this;
        },
        getOpposite: () => {
          return this.from;
        },
      }
    );

    this.model = model;
    this.z = 10;
  }

  get color() {
    return "pink";
  }

  validation(): boolean {
    let can = true;

    [this.from, this.to].map((end) => {
      let overlaps = this.model.overlap.pipeOverlap(end.vec);
      if (overlaps.length > 0) {
        let overlap = overlaps[0];
        let angleBetween;
        if (overlap && overlap.end) {
          angleBetween = overlap.end
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
      return can;
    }

    [this.from, this.to].map((end) => {
      let overlaps = this.model.overlap.direct(end.vec);
      if (overlaps.length > 0) {
        let overlap = overlaps[0];

        if (overlap && overlap.end) {
          if (
            overlap.end.target &&
            !(overlap.end.target.object instanceof Fitting)
          ) {
            can = false;
            console.warn("Target is not empty");
          }
        }

        if (overlap && overlap.io) {
          if (overlap.io.isConnected()) {
            can = false;
            console.warn("Already is connected");
          }
        }
      }
    });

    if (!can) {
      console.warn("Cant merge");
    }

    return can;
  }
}

export default Pipe;
