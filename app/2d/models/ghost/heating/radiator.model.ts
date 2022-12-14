import CanvasModel from "../../canvas.model";
import { IVec, Vector } from "../../../../geometry/vect";
import Main from "../../main.model";
import Pipe from "../../heating/pipe.model";
import { IO } from "../../heating/radiator.model";

class Radiator extends Main {
  model: CanvasModel;
  width: number = 80;
  height: number = 40;

  /**
   * center is left top point
   */
  center: IVec;

  IOs: [IO<Radiator>, IO<Radiator>];

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
        isConnected: () => false,
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
        isConnected: () => false,
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
