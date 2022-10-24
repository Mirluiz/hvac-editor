import { IVec } from "../../geometry/vect";
import Wall from "./architecture/wall.model";
import Pipe from "./heating/pipe.model";

class Canvas {
  private _walls: Array<Wall> = [];
  private _pipes: Array<Pipe> = [];

  actionMode: "default" | "wall" | "pipe" = "pipe";
  actionObject: Wall | Pipe | null = null;

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
  offset: IVec = { x: 0, y: 0 };
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
