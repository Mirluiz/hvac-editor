import { IVec } from "../../../geometry/vect";
import Main from "../main.model";

class Arc extends Main {
  radius: number = 5;
  center: IVec;

  color: string = "#fff";
  width: number = 10;

  constructor(center: IVec) {
    super();

    this.center = center;
  }
}

export default Arc;
