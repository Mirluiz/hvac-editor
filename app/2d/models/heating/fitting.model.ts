import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import Arc from "../geometry/arc.model";
import Pipe from "./pipe.model";

class Fitting extends Arc {
  pipes: Array<{ id: string; connection: "start" | "end" }> = [];

  constructor(center: IVec) {
    super(center);

    this.color = "black";
  }
}

export default Fitting;
