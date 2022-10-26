import Line from "../../geometry/line.model";
import { IVec } from "../../../../geometry/vect";

class Pipe extends Line {
  ghost: boolean = false;
  type: "supply" | "return" = "supply";

  constructor(start: IVec, end: IVec) {
    super(start, end);
  }

  get color() {
    return this.type === "supply" ? "red" : "blue";
  }
}

export default Pipe;
