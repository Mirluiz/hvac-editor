import Line from "../../geometry/line.model";
import { IVec } from "../../../../geometry/vect";
import CanvasModel from "../../canvas.model";

interface IGhostPipeEnd {
  vec: IVec;
  getPipe: () => Pipe;
  getOpposite: () => IGhostPipeEnd;
}

class Pipe extends Line<IGhostPipeEnd> {
  constructor(from: IVec, to: IVec) {
    super(
      {
        vec: from,
        getPipe: () => {
          return this;
        },
        getOpposite: () => {
          return this.to;
        },
      },
      {
        vec: to,
        getPipe: () => {
          return this;
        },
        getOpposite: () => {
          return this.from;
        },
      }
    );
  }

  get color() {
    return "pink";
  }

  validation(model: CanvasModel) {
    let can = true;

    [this.from, this.to].map((end) => {
      let overlaps = model.overlap.pipeOverlap(end.vec);
      if (overlaps.length > 0) {
        let overlap = overlaps[0];
        let angleBetween;
        if (overlap && overlap.pipeEnd) {
          angleBetween = overlap.pipeEnd
            .getOpposite()
            .vec.sub(end.vec)
            .angle(end.getOpposite().vec.sub(end.vec));
        }
        if (angleBetween) {
          console.log(
            "Math.abs(angleBetween * (180 / Math.PI))",
            Math.abs(angleBetween * (180 / Math.PI))
          );
        }
        if (
          angleBetween !== undefined &&
          Math.abs(angleBetween * (180 / Math.PI)) < 90
        ) {
          console.warn("cant merge because of angle");
          can = false;
        }
      }
    });

    return can;
  }
}

export default Pipe;
