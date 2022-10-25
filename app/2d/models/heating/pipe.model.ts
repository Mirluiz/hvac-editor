import { ICoord, IVec, Vector } from "../../../geometry/vect";
import Line from "../geometry/line.model";

class Pipe extends Line {
  temp: boolean = false;
  type: "supply" | "return" = "supply";

  constructor(start: IVec, end: IVec) {
    super(start, end);
  }

  get color() {
    return this.type === "supply" ? "red" : "blue";
  }
}

export default Pipe;
