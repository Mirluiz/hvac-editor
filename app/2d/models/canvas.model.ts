import { IVec } from "../../geometry/vect";
import Wall from "./wall.model";
import Pipe from "./pipe.model";

class Canvas {
  private _walls: Array<Wall> = [];

  actionMode: "default" | "wall" = "default";
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

  addWall(start: IVec, end: IVec) {
    let wall = new Wall(start, end);

    this.walls.push(wall);
    this.walls = this.walls;

    return wall;
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
