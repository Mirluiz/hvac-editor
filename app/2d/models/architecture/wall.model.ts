import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";

class Wall extends Line<IVec> {
  constructor(from: IVec, to: IVec) {
    super(from, to);
  }

  get color() {
    return "grey";
  }
}

export default Wall;
