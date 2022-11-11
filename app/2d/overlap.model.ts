import Pipe, { IPipeEnd } from "./models/heating/pipe.model";
import CanvasModel from "./models/canvas.model";
import { IVec, Vector } from "../geometry/vect";
import Fitting from "./models/heating/fitting.model";
import Radiator, { IO } from "./models/heating/radiator.model";

class Overlap {
  readonly model: CanvasModel;
  boundMouse: IVec | null = null;

  private walls: Array<IOverlap> = [];
  private pipes: Array<IOverlap> = [];
  private valves: Array<IOverlapValve> = [];
  private objectIOs: Array<IOverlap> = [];

  first: IOverlap | null = null;
  list: Array<IOverlap> = [];
  boundList: Array<IOverlap> = [];

  constructor(model: CanvasModel) {
    this.model = model;
  }

  get isEmpty() {
    return this.list.length === 0 && this.boundList.length === 0;
  }

  update() {
    let wMouse = this.model.getWorldCoordinates(
      this.model.mouse.x,
      this.model.mouse.y
    );

    let netBoundMouse = new Vector(
      Math.round(wMouse.x / this.model.config.net.step) *
        this.model.config.net.step,
      Math.round(wMouse.y / this.model.config.net.step) *
        this.model.config.net.step
    );
    let v = new Vector(wMouse.x, wMouse.y);

    this.wallsOverlap();
    this.list = [
      ...this.pipeOverlap(v),
      ...this.IOOverlap(v),
      ...this.fittingOverlap(v),
    ];
    this.boundList = [
      ...this.pipeOverlap(netBoundMouse),
      ...this.IOOverlap(netBoundMouse),
      ...this.fittingOverlap(v),
    ];

    if (this.list.length === 0 && this.boundList.length === 0) {
      this.boundMouse = netBoundMouse.clone();
    }

    this.firstOverlap(v);

    console.log("this", this.list.length, this.first);
  }

  direct(vec: IVec) {
    let list = [
      ...this.pipeOverlap(vec),
      ...this.IOOverlap(vec),
      ...this.fittingOverlap(vec),
    ];

    return list;
  }

  /**
   * it is sorted by height (more height -> more closer to user)
   */
  firstOverlap(vec: IVec) {
    let overlaps = [...this.list, ...this.boundList];

    if (overlaps.length > 0) {
      overlaps.sort((a, b) => {
        let aL = 0;
        let bL = 0;

        if (a.fitting) {
          aL = a.fitting.center.sub(vec).length;
        } else if (a.io) {
          aL = a.io.getVecAbs().sub(vec).length;
        } else if (a.body) {
          aL = a.body.vec.sub(vec).length;
        }

        if (b.fitting) {
          bL = b.fitting.center.sub(vec).length;
        } else if (b.io) {
          bL = b.io.getVecAbs().sub(vec).length;
        } else if (b.body) {
          bL = b.body.vec.sub(vec).length;
        }

        return aL - bL;
      });
    }

    if (overlaps.length > 0) {
      overlaps.sort((a, b) => {
        let aZ = 0;
        let bZ = 0;

        if (a.fitting) {
          aZ = a.fitting.center.z + a.fitting.width;
        } else if (a.io) {
          aZ = a.io.getVecAbs().z;
        } else if (a.body) {
          aZ = a.body.vec.z;
        }

        if (b.fitting) {
          bZ = b.fitting.center.z + b.fitting.width;
        } else if (b.io) {
          bZ = b.io.getVecAbs().z;
        } else if (b.body) {
          bZ = b.body.vec.z;
        }

        return aZ - bZ;
      });
    }

    this.first = overlaps.reverse()[0];
  }

  wallsOverlap() {
    this.model.walls.map(() => {});
  }

  //Todo: currently all project use this, split it.
  pipeOverlap(vec: IVec): Array<IOverlap> {
    let ret: Array<IOverlap> = [];

    let bind = this.model.config.overlap.bindDistance;

    this.model.pipes.map((pipe) => {
      let _p: IOverlap | null = null;

      if (pipe.from.vec.sub(vec).length <= bind) {
        _p = {
          id: pipe.id,
          end: pipe.from,
        };
      }

      if (!_p && pipe.to.vec.sub(vec).length <= bind) {
        _p = {
          id: pipe.id,
          end: pipe.to,
        };
      }

      if (!_p) {
        let l = vec.distanceToLine(pipe);

        if (l <= bind) {
          let normPipe = pipe.toOrigin().normalize();
          let projPipe = pipe.toOrigin().projection(vec.sub(pipe.from.vec));

          _p = {
            id: pipe.id,
            body: {
              object: pipe,
              vec: normPipe.multiply(projPipe).sum(pipe.from.vec),
            },
          };
        }
      }

      if (_p) ret.push(_p);
    });

    return ret;
  }

  fittingOverlap(vec: IVec): Array<IOverlap> {
    let ret: Array<IOverlap> = [];

    let bind = this.model.config.overlap.bindDistance;

    this.model.fittings.map((fitting) => {
      let _f: IOverlap | null = null;

      if (fitting.center.sub(vec).length <= bind) {
        _f = {
          id: fitting.id,
          fitting: fitting,
        };
      }

      if (_f) ret.push(_f);
    });

    if (ret.length > 1) {
      ret.sort((a, b) => {
        return 1;
        // return a.io?.vec.x -
      });
    }

    return ret;
  }

  IOOverlap(vec: IVec): Array<IOverlap> {
    let ret: Array<IOverlap> = [];

    let bind = this.model.config.overlap.bindDistance;

    this.model.radiators.map((radiator) => {
      radiator.IOs.map((io) => {
        let _r: IOverlap | null = null;
        if (io.getVecAbs().sub(vec).length <= bind) {
          _r = {
            id: radiator.id,
            io: io,
          };
        }

        if (_r) ret.push(_r);
      });
    });

    if (ret.length > 1) {
      ret.sort((a, b) => {
        return 1;
        // return a.io?.vec.x -
      });
    }

    return ret;
  }
}

export interface IOverlap {
  id: string;
  body?: IOverlapBody<Pipe>;
  end?: IPipeEnd;
  fitting?: Fitting;
  io?: IO<Radiator>;
}

export interface IOverlapBody<T> {
  object: T;
  vec: IVec;
}

export interface IOverlapValve extends IOverlap {}

export default Overlap;
