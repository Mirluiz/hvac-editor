import { IVec, Vector } from "../../../geometry/vect";
import Pipe from "./pipe.model";
import CanvasModel from "../canvas.model";
import Main from "../main.model";
import RadiatorModel from "../ghost/heating/radiator.model";

export interface IRadiatorIO<T> {
  vec: IVec;
  type: "return" | "supply";
  getRadiator: () => T;
}

class Radiator extends Main {
  model: CanvasModel;
  width: number = 80;
  height: number = 40;
  center: IVec;
  IOs: [IRadiatorIO<Radiator>, IRadiatorIO<Radiator>];

  constructor(model: CanvasModel, center: IVec) {
    super();

    this.IOs = [
      {
        type: "return",
        getRadiator: () => {
          return this;
        },
        vec: new Vector(-10, 0),
      },

      {
        type: "supply",
        getRadiator: () => {
          return this;
        },
        vec: new Vector(-10, 40),
      },
    ];

    this.center = center;
    this.model = model;
  }

  get pipes(): Array<Pipe> {
    return [];
  }

  beforeMerge() {
    return true;
  }

  merge(): boolean {
    let merged = false;

    if (!this.beforeMerge()) return false;

    this.afterMerge();

    return merged;
  }

  afterMerge() {}

  isClose(v: IVec) {
    let distance = this.model.config.overlap.bindDistance;

    return this.center.sub(v).length <= distance;
  }
}

export default Radiator;
