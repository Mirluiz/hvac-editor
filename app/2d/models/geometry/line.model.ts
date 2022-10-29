import { IVec } from "../../../geometry/vect";
import Main from "../main.model";

class Line<T = { vec: IVec }> extends Main {
  from: T;
  to: T;

  width: number = 1;

  constructor(from: T, to: T) {
    super();

    this.from = from;
    this.to = to;
  }
}

export default Line;
