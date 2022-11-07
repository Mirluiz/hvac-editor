import { IVec, Vector } from "../../../geometry/vect";
import Pipe from "./pipe.model";
import CanvasModel from "../canvas.model";
import Main from "../main.model";
import RadiatorModel from "../ghost/heating/radiator.model";

export interface IO<T> {
  vec: IVec;
  getVecAbs: () => IVec;
  type: "return" | "supply";
  getRadiator: () => T;
  isConnected: () => boolean;
}

class Radiator extends Main {
  model: CanvasModel;
  width: number = 80;
  height: number = 40;
  center: IVec; // left top position
  objectCenter: IVec; // center of object
  IOs: [IO<Radiator>, IO<Radiator>];

  constructor(model: CanvasModel, center: IVec) {
    super();

    this.IOs = [
      {
        type: "return",
        getVecAbs: () => {
          let v = new Vector(-10, 0);
          return v.sum(this.objectCenter).sum(this.center);
        },
        getRadiator: () => {
          return this;
        },
        vec: new Vector(-10, 0),
        isConnected: () => {
          let ret = this.model.pipes.find((p) => {
            return (
              (p.from.target?.object?.id === this.id &&
                p.from.target?.io?.type === "return") ||
              (p.to.target?.object?.id === this.id &&
                p.to.target?.io?.type === "return")
            );
          });
          return Boolean(ret);
        },
      },

      {
        type: "supply",
        getVecAbs: () => {
          let v = new Vector(-10, 40);
          return v.sum(this.objectCenter).sum(this.center);
        },
        getRadiator: () => {
          return this;
        },
        vec: new Vector(-10, 40),
        isConnected: () => {
          let ret = this.model.pipes.find((p) => {
            return (
              (p.from.target?.object?.id === this.id &&
                p.from.target?.io?.type === "supply") ||
              (p.to.target?.object?.id === this.id &&
                p.to.target?.io?.type === "supply")
            );
          });
          return Boolean(ret);
        },
      },
    ];

    this.center = center;
    this.model = model;
    this.objectCenter = new Vector(this.width / 2, this.height / 2).reverse();
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
    let ret: IO<Radiator> | undefined = undefined;

    for (let io of this.IOs) {
      if (io.getVecAbs().sub(v).length <= distance) {
        ret = io;
      }
    }

    return ret;
  }
}

export default Radiator;
