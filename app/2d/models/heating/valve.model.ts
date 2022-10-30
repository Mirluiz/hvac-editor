import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import Arc from "../geometry/arc.model";
import Pipe from "./pipe.model";

class Valve extends Arc {
  pipes: Array<{ id: string }> = [];

  constructor(center: IVec) {
    super(center);
  }
}

export default Valve;
