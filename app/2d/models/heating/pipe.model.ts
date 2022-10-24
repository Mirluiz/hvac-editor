import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";

class Pipe extends Line {
  constructor(start: IVec, end: IVec) {
    super(start, end);
  }

  getNearestPipe(pipes: Array<Pipe>) {
    let isTail: boolean | "start" | "end" = false;

    pipes.map((pipe) => {});
  }
}

export default Pipe;
