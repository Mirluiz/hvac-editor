import { IVec } from "../../../geometry/vect";
import Main from "../main.model";

class Line extends Main {
  thickness: number = 1;
  start: IVec;
  end: IVec;

  _color: string = "#000";
  width: number = 1;

  constructor(start: IVec, end: IVec) {
    super();

    this.start = start;
    this.end = end;
  }

  // getNearest(pipes: Array<Pipe>) {
  //   let pipe = pipes.find((pipe) => {
  //     if (pipe._id === this._id) return;
  //
  //     let start = pipe.start.distanceTo(this.end);
  //     let end = pipe.end.distanceTo(this.end);
  //
  //     return (start && start < 30) || (end && end < 30);
  //   });
  //
  //   return pipe;
  // }
  //
  // getNearestCoordinateOnPipe(coord: IVec, pipe: Pipe) {
  //   let _coord = coord.sub(pipe.start);
  // }

  get color() {
    return this._color;
  }

  set color(color: string) {
    this._color = color;
  }
}

export default Line;
