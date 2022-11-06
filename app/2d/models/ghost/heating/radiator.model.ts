import CanvasModel from "../../canvas.model";
import { IVec, Vector } from "../../../../geometry/vect";
import Main from "../../main.model";
import Pipe from "../../heating/pipe.model";
import { IRadiatorIO } from "../../heating/radiator.model";

class Radiator extends Main {
  model: CanvasModel;
  width: number = 80;
  height: number = 40;

  /**
   * center is left top point
   */
  center: IVec;

  IOs: [IRadiatorIO<Radiator>, IRadiatorIO<Radiator>];

  constructor(model: CanvasModel, center: IVec) {
    super();

    this.IOs = [
      {
        type: "return",
        getVecAbs: () => {
          let v = new Vector(-10, 0);
          return v.sum(this.center);
        },
        getRadiator: () => {
          return this;
        },
        vec: new Vector(-10, 0),
      },

      {
        type: "supply",
        getVecAbs: () => {
          let v = new Vector(-10, 40);
          return v.sum(this.center);
        },
        getRadiator: () => {
          return this;
        },
        vec: new Vector(-10, 40),
      },
    ];

    this.center = center;
    this.model = model;
  }

  validation(): boolean {
    return true;
  }
}

export default Radiator;
