import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";
import Arc from "../geometry/arc.model";

class Valve extends Arc {
  constructor(center: IVec) {
    super(center);
  }
}

export default Valve;
