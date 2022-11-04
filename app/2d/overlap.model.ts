import Wall from "./models/architecture/wall.model";
import Pipe, { IPipeEnd } from "./models/heating/pipe.model";
import Valve from "./models/heating/valve.model";
import CanvasModel from "./models/canvas.model";
import { IVec, Vector } from "../geometry/vect";
import Fitting from "./models/heating/fitting.model";

class Overlap {
  readonly model: CanvasModel;

  mouse: IVec | null = null;
  netBoundMouse: IVec | null = null;

  private walls: Array<IOverlap> = [];
  private pipes: Array<IOverlap> = [];
  private valves: Array<IOverlapValve> = [];

  list: Array<IOverlap> = [];
  netBoundList: Array<IOverlap> = [];

  constructor(model: CanvasModel) {
    this.model = model;
  }

  update() {
    let v = new Vector(this.model.netBoundMouse.x, this.model.netBoundMouse.y);

    this.wallsOverlap();
    this.list = [...this.pipeOverlap(v)];
    this.updateList();
    // this.updateNetBoundList();
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
            pipe: {
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

  updateList() {
    this.list = [];

    this.list.push(...this.pipes);
  }
}

export interface IOverlap {
  id: string;
  pipe?: { object: Pipe; vec: IVec };
  pipeEnd?: IPipeEnd;
  fitting?: Fitting;
}

export interface IOverlapValve extends IOverlap {}

export default Overlap;
