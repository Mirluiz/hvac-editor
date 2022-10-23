import { IVec } from "../../geometry/vect";

class Wall {
  start: IVec;
  end: IVec;
  thickness: number = 1;

  constructor(start: IVec, end: IVec) {
    this.start = start;
    this.end = end;
  }
}

export default Wall;
