import { ICoord, IVec, Vector } from "../../../geometry/vect";
import Line from "../geometry/line.model";

class Pipe extends Line {
  constructor(start: IVec, end: IVec) {
    super(start, end);
  }

  getNearestPipe(pipes: Array<Pipe>) {
    let pipe = pipes.find((pipe) => {
      if (pipe._id === this._id) return;

      let start = pipe.start.distanceTo(this.end);
      let end = pipe.end.distanceTo(this.end);

      return (start && start < 30) || (end && end < 30);
    });

    return pipe;
  }

  getNearestCoordinateOnPipe(coord: IVec, pipe: Pipe) {
    let _coord = coord.sub(pipe.start);
  }
}

export default Pipe;
