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
      bindDistance: 0,
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

  // update() {
  //   let mergedPipes: Array<Pipe> = [];
  //   let createdFittings: Array<Fitting> = [];
  //
  //   this.pipes.map((p) => {
  //     this.pipes.map((_p) => {
  //       if (_p.id === p.id) return;
  //       let _ = this.pipeMerge(_p, p);
  //       if (_) {
  //         this.pipes = this.pipes.filter((__p) => __p.id !== p.id);
  //
  //         _.pipes.map((p) => {
  //           mergedPipes.push(p);
  //         });
  //
  //         _.fittings.map((f) => {
  //           createdFittings.push(f);
  //         });
  //       }
  //     });
  //   });
  //
  //   if (mergedPipes.length > 0) mergedPipes.map((mP) => this.addPipe(mP));
  //   if (createdFittings.length > 0) {
  //     createdFittings.map((cF) => this.addFitting(cF));
  //   }
  // }

  mergeController(p: Pipe, end: IVec) {
    this.pipes.map((pipe) => {
      if (p.id === pipe.id) return;

      if (end.distanceToLine(pipe) <= this.config.overlap.bindDistance) {
        let normPipe = pipe.toOrigin().normalize();
        let projPipe = pipe.toOrigin().projection(end.sub(pipe.start));

        let mergePoint = normPipe.multiply(projPipe).sum(pipe.start);

        let newP1 = new Pipe(
          new Vector(0, 0).sum(pipe.start),
          new Vector(mergePoint.x, mergePoint.y)
        );
        let newP2 = new Pipe(
          new Vector(mergePoint.x, mergePoint.y),
          new Vector(pipe.end.x, pipe.end.y)
        );

        this.addPipe(newP1);
        this.addPipe(newP2);
        this.pipes = this.pipes.filter((_p) => _p.id !== pipe.id);

        let newFitting = new Fitting(mergePoint);
        this.addFitting(newFitting);
      }
    });
  }

  pipeMerge(
    pipe1: Pipe,
    pipe2: Pipe
  ): false | { pipes: Array<Pipe>; fittings: Array<Fitting> } {
    if (pipe1.id === pipe2.id) return false;

    let ret: { pipes: Array<Pipe>; fittings: Array<Fitting> } = {
      pipes: [],
      fittings: [],
    };

    let merged, mergePoint;

    if (pipe1.start.distanceToLine(pipe2) <= this.config.overlap.bindDistance) {
      let normPipe = pipe2.toOrigin().normalize();
      let projPipe = pipe2.toOrigin().projection(pipe1.end.sub(pipe2.start));

      mergePoint = normPipe.multiply(projPipe);

      let newP1 = new Pipe(
        new Vector(0, 0).sum(pipe2.start),
        new Vector(mergePoint.x, mergePoint.y).sum(pipe2.start)
      );
      let newP2 = new Pipe(
        new Vector(mergePoint.x, mergePoint.y).sum(pipe2.start),
        new Vector(pipe2.end.x, pipe2.end.y).sum(pipe2.start)
      );

      ret.pipes.push(newP1);
      ret.pipes.push(newP2);
      mergePoint = mergePoint.sum(pipe2.start);

      merged = true;
    } else if (
      pipe1.end.distanceToLine(pipe2) <= this.config.overlap.bindDistance
    ) {
      let normPipe = pipe2.toOrigin().normalize();
      let projPipe = pipe2.toOrigin().projection(pipe1.end.sub(pipe2.start));

      mergePoint = normPipe.multiply(projPipe);

      let newP1 = new Pipe(
        new Vector(0, 0).sum(pipe2.start),
        new Vector(mergePoint.x, mergePoint.y).sum(pipe2.start)
      );
      let newP2 = new Pipe(
        new Vector(mergePoint.x, mergePoint.y).sum(pipe2.start),
        new Vector(pipe2.end.x, pipe2.end.y)
      );

      ret.pipes.push(newP1);
      ret.pipes.push(newP2);
      mergePoint = mergePoint.sum(pipe2.start);

      merged = true;
    }

    if (merged && mergePoint) {
      let newFitting = new Fitting(mergePoint);
      ret.fittings.push(newFitting);
    }

    return ret;
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
    bindDistance: 0 | 20;
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
