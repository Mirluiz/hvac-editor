import { IVec } from "../../../geometry/vect";
import Main from "../main.model";

class Line extends Main {
  thickness: number = 1;
  start: IVec;
  end: IVec;

  color: string = "#fff";
  width: number = 1;

  constructor(start: IVec, end: IVec) {
    super();

    this.start = start;
    this.end = end;
  }
}

export default Line;
