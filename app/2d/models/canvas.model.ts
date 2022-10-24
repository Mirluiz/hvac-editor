import { IVec, Vector } from "../../geometry/vect";
import Wall from "./architecture/wall.model";
import Pipe from "./heating/pipe.model";
import Valve from "./heating/valve.model";

class Canvas {
  private _walls: Array<Wall> = [];
  private _pipes: Array<Pipe> = [];
  private _valves: Array<Valve> = [];

  actionMode: "default" | "wall" | "pipe" | "valve" = "pipe";
  actionObject: Wall | Pipe | null = null;
  placingObject: Valve | null = null;

  mouse: IVec | null = null;
  canvasSize: IVec | null = null;
  mouseCanvasRatio: IVec | null = null;
  scale: {
    amount: number;
    coord: IVec | null;
    limitReached: boolean;
  } = {
    amount: 1,
    coord: null,
    limitReached: false,
  };
  clicked: boolean = false;
  keyboard: string | null = null;
  offset: Vector = new Vector(0, 0);
  config: IConfig = {
    axis: {
      show: true,
    },
    net: {
      bind: true,
      show: true,
      step: 20,
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

  addWall(start: IVec, end: IVec) {
    let wall = new Wall(start, end);

    wall.color = "black";
    wall.width = 5;

    this.walls.push(wall);
    this.walls = this.walls;

    return wall;
  }

  addPipe(start: IVec, end: IVec) {
    let pipe = new Pipe(start, end);

    pipe.color = "red";
    pipe.width = 2;

    this.pipes.push(pipe);
    this.pipes = this.pipes;

    return pipe;
  }

  addValve(center: IVec) {
    let valve = new Valve(center);

    valve.color = "red";
    valve.width = 2;

    this.valves.push(valve);
    this.valves = this.valves;

    return valve;
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
}

export default Canvas;
