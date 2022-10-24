import { IVec } from "../../../geometry/vect";

class Arc {
  radius: number = 5;
  center: IVec;

  color: string = "#fff";
  width: number = 1;

  constructor(center: IVec) {
    this.center = center;
  }
}

export default Arc;
