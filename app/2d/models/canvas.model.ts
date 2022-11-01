import { ICoord, IVec, Vector } from "../../geometry/vect";
import Wall from "./architecture/wall.model";
import Pipe from "./heating/pipe.model";
import GhostPipe from "./ghost/heating/pipe.model";
import Valve from "./heating/valve.model";
import Overlap from "../overlap.model";
import Fitting from "./heating/fitting.model";
import { fittingModel } from "../../_test_/common";

class Canvas {
  private _walls: Array<Wall> = [];
  private _pipes: Array<Pipe> = [];
  private _valves: Array<Valve> = [];
  private _fittings: Array<Fitting> = [];
  overlap: Overlap;

  mode: "default" | "wall" | "pipe" | "valve" = "pipe";
  subMode: "supply" | "return" | null = null;
  actionMode: "pipeLaying" | "wallLaying" | null = null;
  actionObject: Wall | Pipe | null | GhostPipe = null;
  placingObject: Valve | null = null;

  constructor() {
    this.overlap = new Overlap(this);

    fittingModel(this);
  }

  mouse: ICoord | null = null;
  canvasSize: ICoord | null = null;
  mouseCanvasRatio: ICoord | null = null;
  scale: {
    amount: number;
    coord: ICoord | null;
    limitReached: boolean;
  } = {
    amount: 1,
    coord: null,
    limitReached: false,
  };
  clicked: boolean = false;
  keyboard: string | null = null;
  offset: ICoord = { x: 0, y: 0 };
  config: IConfig = {
    axis: {
      show: true,
    },
    net: {
      bind: true,
      show: true,
      step: 20,
    },
    overlap: {
      bindDistance: 10,
    },
  };

  get walls(): Array<Wall> {
    return this._walls;
  }

  set walls(value: Array<Wall>) {
    this._walls = value;
  }

  get pipes(): Array<Pipe> {
    return this._pipes;
  }

  set pipes(value: Array<Pipe>) {
    this._pipes = value;
  }

  get valves(): Array<Valve> {
    return this._valves;
  }

  set valves(value: Array<Valve>) {
    this._valves = value;
  }

  get fittings(): Array<Fitting> {
    return this._fittings;
  }

  set fittings(value: Array<Fitting>) {
    this._fittings = value;
  }

  addWall(wall: Wall) {
    this.walls.push(wall);
    this.walls = this.walls;

    return wall;
  }

  addPipe(pipe: Pipe) {
    this.pipes.push(pipe);
    this.pipes = this.pipes;

    return this.pipes[this.pipes.length - 1];
  }

  addFitting(fitting: Fitting) {
    this.fittings.push(fitting);
    this.fittings = this.fittings;

    return this.fittings[this.fittings.length - 1];
  }

  getPipeByID(id: string) {
    return this.pipes.find((p) => p.id === id);
  }

  update() {
    this.pipes.map((pipe) => {
      this.pipes.map((_pipe) => {
        if (_pipe.id === pipe.id) return;

        if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
          pipe.merge(_pipe);
        }
      });

      this.fittings.map((fitting) => {
        if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
          pipe.connect(fitting);
        }

        if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
          pipe.connect(fitting);
        }
      });
    });
  }

  //TODO: apply scale transformation here
  getWorldCoordinates(x: number, y: number): IVec {
    return new Vector(
      (x + this.offset.x) * this.scale.amount,
      (y + this.offset.y) * this.scale.amount
    );
  }

  //x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord.x,
  //       y: (y + this.model.offset.y)  * this.model.scale.amount,
  getLocalCoordinates(x: number, y: number) {
    let _this = this;

    let scale = function (vec: IVec): Vector {
      return new Vector(vec.x * _this.scale.amount, vec.y * _this.scale.amount);
    };

    let translate = function (vec: IVec): Vector {
      return new Vector(vec.x + _this.offset.x, vec.y + _this.offset.y);
    }.bind(this);

    let t = new Vector(x, y);
    t = scale(t);
    // t = rotation(t); TODO order is scaling rotation translation
    t = translate(t);

    return t;
  }

  deletePipe(id: string) {
    this.pipes = this.pipes.filter((p) => p.id !== id);
  }
}

interface IConfig {
  axis: {
    show: boolean;
  };
  net: {
    bind: boolean;
    show: boolean;
    step: 15 | 20 | 50;
  };
  overlap: {
    bindDistance: 10 | 20;
  };
}

export default Canvas;
