import { ICoord, IVec, Vector } from "../../geometry/vect";
import Wall from "./architecture/wall.model";
import Pipe from "./heating/pipe.model";
import Valve from "./heating/valve.model";
import Overlap from "../overlap.model";
import Fitting from "./heating/fitting.model";

class Canvas {
  private _walls: Array<Wall> = [];
  private _pipes: Array<Pipe> = [];
  private _valves: Array<Valve> = [];
  private _fittings: Array<Fitting> = [];
  overlap: Overlap;

  mode: "default" | "wall" | "pipe" | "valve" = "pipe";
  subMode: "supply" | "return" | null = null;
  actionMode: "pipeLaying" | "wallLaying" | null = null;
  actionObject: Wall | Pipe | null = null;
  placingObject: Valve | null = null;

  constructor() {
    this.overlap = new Overlap(this);

    this.pipes.push(new Pipe(new Vector(40, 100), new Vector(300, 100)));
    // this.pipes.push(new Pipe(new Vector(40, 200), new Vector(100, 260)));
    // this.pipes.push(new Pipe(new Vector(40, 380), new Vector(100, 320)));
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

  mergeController(p: Pipe, end: IVec) {
    this.pipes.map((pipe) => {
      if (p.id === pipe.id) return;

      if (
        pipe.start.sub(end).length <= this.config.overlap.bindDistance ||
        pipe.end.sub(end).length <= this.config.overlap.bindDistance ||
        end.distanceToLine(pipe) <= this.config.overlap.bindDistance
      ) {
        let pipePart: "start" | "end" | "body" = "body";

        if (pipe.start.sub(end).length <= this.config.overlap.bindDistance) {
          pipePart = "start";
        }
        if (pipe.end.sub(end).length <= this.config.overlap.bindDistance) {
          pipePart = "end";
        }

        let mergePoint;

        if (pipePart === "start") {
          mergePoint = pipe.start.clone();
        } else if (pipePart === "end") {
          mergePoint = pipe.end.clone();
        } else {
          let normPipe = pipe.toOrigin().normalize();
          let projPipe = pipe.toOrigin().projection(end.sub(pipe.start));

          mergePoint = normPipe.multiply(projPipe).sum(pipe.start);
          mergePoint = mergePoint.bindNet(this.config.net.step);

          let newP1 = new Pipe(
            new Vector(0, 0).sum(pipe.start),
            new Vector(mergePoint.x, mergePoint.y)
          );
          let newP2 = new Pipe(
            new Vector(mergePoint.x, mergePoint.y),
            new Vector(pipe.end.x, pipe.end.y)
          );

          end = mergePoint.clone();

          this.addPipe(newP1);
          this.addPipe(newP2);
          this.pipes = this.pipes.filter((_p) => _p.id !== pipe.id);
        }

        let newFitting = new Fitting(mergePoint);
        this.addFitting(newFitting);
      }
    });
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

interface IHoveredObject {
  id: string;
  type: "wall" | "pipe" | "valve";
  hoveredPart?: {
    pipe: "start" | "end" | "body";
  };
}

export default Canvas;
