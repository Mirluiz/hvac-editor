import Wall from "./models/architecture/wall.model";
import Pipe from "./models/heating/pipe.model";
import Valve from "./models/heating/valve.model";
import CanvasModel from "./models/canvas.model";
import { IVec, Vector } from "../geometry/vect";

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

  update(mouse: IVec) {
    this.mouse = mouse;
    // console.log('---')
    // if (!this.model.mouse) return;

    this.wallsOverlap();
    this.pipeOverlap();
    this.updateList();
    // this.updateNetBoundList();
  }

  wallsOverlap() {
    this.model.walls.map(() => {});
  }

  pipeOverlap() {
    this.pipes = [];

    this.model.pipes.map((pipe) => {
      if (!this.mouse) return;

      let _p: IOverlap | null = null;

      // if (pipe.start.sub(this.mouse).length < 40) {
      //   _p = {
      //     type: "pipe",
      //     id: pipe.id,
      //     part: "start",
      //     partCoordinate: new Vector(pipe.start.x, pipe.start.y),
      //   };
      // }
      //
      // if (!_p && pipe.end.sub(this.mouse).length < 40) {
      //   _p = {
      //     type: "pipe",
      //     id: pipe.id,
      //     part: "end",
      //     partCoordinate: new Vector(pipe.end.x, pipe.end.y),
      //   };
      // }

      if (!_p) {
        let l = this.mouse.distanceToLine(pipe);

        if (l < 40) {
          let normPipe = pipe.toOrigin().normalize();
          let projPipe = pipe.toOrigin().projection(this.mouse.sub(pipe.start));

          _p = {
            type: "pipe",
            id: pipe.id,
            part: "body",
            partCoordinate: normPipe.multiply(projPipe).sum(pipe.start),
          };
        }
      }

      if (_p) this.pipes.push(_p);
    });
  }

  updateList() {
    this.list = [];

    this.list.push(...this.pipes);
  }
}

interface IOverlap {
  id: string;
  type: "wall" | "pipe" | "valve";
  part?: "start" | "end" | "body";
  partCoordinate?: IVec;
}

export interface IOverlapValve extends IOverlap {}

export default Overlap;
