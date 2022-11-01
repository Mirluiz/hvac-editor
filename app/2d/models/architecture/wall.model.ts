import { IVec } from "../../../geometry/vect";
import Line from "../geometry/line.model";

class Wall extends Line {
  constructor(from: IVec, to: IVec) {
    super({ vec: from }, { vec: to });
  }

  get color() {
    return "grey";
  }
}

export default Wall;
