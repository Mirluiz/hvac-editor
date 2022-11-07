import Wall from "./models/architecture/wall.model";
import Pipe, { IPipeEnd } from "./models/heating/pipe.model";
import Valve from "./models/heating/valve.model";
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

  list: Array<IOverlap> = [];
  boundList: Array<IOverlap> = [];

  constructor(model: CanvasModel) {
    this.model = model;
  }

  get isEmpty() {
    return this.list.length === 0 && this.boundList.length === 0;
  }

  update() {
    let netBoundMouse = new Vector(
      Math.round(this.model.mouse.x / this.model.config.net.step) *
        this.model.config.net.step,
      Math.round(this.model.mouse.y / this.model.config.net.step) *
        this.model.config.net.step
    );
    let v = new Vector(this.model.mouse.x, this.model.mouse.y);

    this.wallsOverlap();
    this.list = [...this.pipeOverlap(v), ...this.IOOverlap(v)];
    this.boundList = [
      ...this.pipeOverlap(netBoundMouse),
      ...this.IOOverlap(netBoundMouse),
    ];

    if (this.list.length === 0 && this.boundList.length === 0) {
      this.boundMouse = netBoundMouse.clone();
    }
    // else {
    //   let firstElement = [...this.list, ...this.boundList][0];
    //
    //   if (firstElement.pipe) {
    //     this.boundMouse = firstElement.pipe.vec;
    //   } else if (firstElement.io) {
    //     this.boundMouse = firstElement.io.getVecAbs();
    //   } else if (firstElement.fitting) {
    //     this.boundMouse = firstElement.fitting.center;
    //   } else if (firstElement.pipeEnd) {
    //     this.boundMouse = firstElement.pipeEnd.vec;
    //   } else {
    //     this.boundMouse = netBoundMouse.clone();
    //   }
    // }
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
          pipeEnd: pipe.from,
        };
      }

      if (!_p && pipe.to.vec.sub(vec).length <= bind) {
        _p = {
          id: pipe.id,
          pipeEnd: pipe.to,
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
  pipeEnd?: IPipeEnd;
  fitting?: Fitting;
  io?: IO<Radiator>;
}

export interface IOverlapBody<T> {
  object: T;
  vec: IVec;
}

export interface IOverlapValve extends IOverlap {}

export default Overlap;
