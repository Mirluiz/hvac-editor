import Line from "../../geometry/line.model";
import { IVec } from "../../../../geometry/vect";

class Pipe extends Line {
  constructor(start: IVec, end: IVec) {
    super(start, end);
  }

  get color() {
    return "pink";
  }
}

export default Pipe;
