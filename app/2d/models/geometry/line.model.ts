import { IVec } from "../../../geometry/vect";

class Line {
  thickness: number = 1;
  start: IVec;
  end: IVec;

  color: string = "#fff";
  width: number = 1;

  constructor(start: IVec, end: IVec) {
    this.start = start;
    this.end = end;
  }
}

export default Line;
