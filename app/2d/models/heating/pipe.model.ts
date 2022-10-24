import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";

class Pipe extends Line {
  constructor(start: IVec, end: IVec) {
    super(start, end);
  }
}

export default Pipe;
