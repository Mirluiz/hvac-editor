import Line from "../../geometry/line.model";
import { IVec } from "../../../../geometry/vect";

class Pipe extends Line<{ vec: IVec }> {
  constructor(from: IVec, to: IVec) {
    super({ vec: from }, { vec: to });
  }

  get color() {
    return "pink";
  }
}

export default Pipe;
