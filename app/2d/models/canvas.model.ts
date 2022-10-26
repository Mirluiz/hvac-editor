import { ICoord, IVec, Vector } from "../../geometry/vect";
import Wall from "./architecture/wall.model";
import Pipe from "./heating/pipe.model";
import Valve from "./heating/valve.model";
import Overlap from "../overlap.model";

class Canvas {
  private _walls: Array<Wall> = [];
  private _pipes: Array<Pipe> = [];
  private _valves: Array<Valve> = [];
  overlap: Overlap;

  actionMode: "pipeLaying" | "wallLaying" | null = null;
  mode: "default" | "wall" | "pipe" | "valve" = "pipe";
  // actionObject: Wall | Pipe | null = null;
  // placingObject: Valve | null = null;

  constructor() {
    this.overlap = new Overlap(this);

    // let p = new Pipe(new Vector(60, 60), new Vector(560, 60));
    // p.type = "supply";
    // p.width = 5;
    this.pipes.push(new Pipe(new Vector(40, 100), new Vector(300, 100)));
    this.pipes.push(new Pipe(new Vector(40, 200), new Vector(100, 260)));
    this.pipes.push(new Pipe(new Vector(40, 380), new Vector(100, 320)));
  }

  nearestObject: IVec | null = null;

  hoveredObjects: Array<IHoveredObject> = [];

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

  addValve(v: Valve) {
    this.valves.push(v);
    this.valves = this.valves;

    return this.valves[this.valves.length - 1];
  }

  getPipeByID(id: string) {
    return this.pipes.find((p) => p.id === id);
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

interface IHoveredObject {
  id: string;
  type: "wall" | "pipe" | "valve";
  hoveredPart?: {
    pipe: "start" | "end" | "body";
  };
}

export default Canvas;
