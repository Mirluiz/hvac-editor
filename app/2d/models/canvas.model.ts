import { ICoord, IVec, Vector } from "../../geometry/vect";
import Wall from "./architecture/wall.model";
import Pipe from "./heating/pipe.model";
import GhostPipe from "./ghost/heating/pipe.model";
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
  actionObject: Wall | Pipe | null | GhostPipe = null;
  placingObject: Valve | null = null;

  constructor() {
    this.overlap = new Overlap(this);

    let arraysForLeftCheck = [
      /*
          1 - from right bottom to top
          2 - from left to right
         */
      [
        {
          x1: 100,
          y1: 100,
          x2: 100,
          y2: 40,
        },
        {
          x1: 40,
          y1: 40,
          x2: 100,
          y2: 40,
        },
      ],
      /*
                1 - from right top to left
                2 - from right to bottom
               */
      [
        {
          x1: 100,
          y1: 40,
          x2: 40,
          y2: 40,
        },
        {
          x1: 100,
          y1: 40,
          x2: 100,
          y2: 100,
        },
      ],
      /*
        1 - from left top to right
        2 - from right top to bottom
       */
      [
        {
          x1: 40,
          y1: 40,
          x2: 100,
          y2: 40,
        },
        {
          x1: 100,
          y1: 40,
          x2: 100,
          y2: 100,
        },
      ],
      /*
      1 - from right bottom to top
      2 - from right to left
     */
      [
        {
          x1: 100,
          y1: 100,
          x2: 100,
          y2: 40,
        },
        {
          x1: 100,
          y1: 40,
          x2: 40,
          y2: 40,
        },
      ],
    ];

    let arraysForRightCheck = [
      /*
          1 - from bottom to top
          2 - from left to right
         */
      [
        {
          x1: 40,
          y1: 40,
          x2: 40,
          y2: 100,
        },
        {
          x1: 40,
          y1: 40,
          x2: 100,
          y2: 40,
        },
      ],
      /*
        1 - from right top to left
        2 - from top to bottom
       */
      [
        {
          x1: 100,
          y1: 40,
          x2: 40,
          y2: 40,
        },
        {
          x1: 40,
          y1: 40,
          x2: 40,
          y2: 100,
        },
      ],
      /*
        1 - from left top to right
        2 - from top to bottom
       */
      [
        {
          x1: 40,
          y1: 40,
          x2: 100,
          y2: 40,
        },
        {
          x1: 40,
          y1: 40,
          x2: 40,
          y2: 100,
        },
      ],
      /*
      1 - from right to left
      2 - from bottom to top
     */
      [
        {
          x1: 100,
          y1: 40,
          x2: 40,
          y2: 40,
        },
        {
          x1: 40,
          y1: 100,
          x2: 40,
          y2: 40,
        },
      ],
    ];

    arraysForLeftCheck.map((lines, index) => {
      lines.map((line) => {
        this.pipes.push(
          new Pipe(
            this,
            new Vector(100 * index + line.x1, line.y1),
            new Vector(100 * index + line.x2, line.y2)
          )
        );
      });
    });

    arraysForRightCheck.map((lines, index) => {
      lines.map((line) => {
        this.pipes.push(
          new Pipe(
            this,
            new Vector(100 * index + line.x1, 100 + line.y1),
            new Vector(100 * index + line.x2, 100 + line.y2)
          )
        );
      });
    });

    // this.pipes.push(new Pipe(this, new Vector(40, 100), new Vector(300, 100)));
    // this.pipes.push(new Pipe(this, new Vector(300, 100), new Vector(300, 500)));
    //
    // this.pipes.push(new Pipe(this, new Vector(600, 100), new Vector(700, 100)));
    // this.pipes.push(new Pipe(this, new Vector(700, 500), new Vector(700, 100)));
    // this.pipes.push(new Pipe(new Vector(40, 200), new Vector(100, 260)));
    // this.pipes.push(new Pipe(new Vector(40, 380), new Vector(100, 320)));
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
