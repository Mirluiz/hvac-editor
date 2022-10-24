import Line from "../2d/models/geometry/line.model";

export class Vector implements IVec {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  distanceTo(v: IVec) {
    let _v = new Vector(this.x - v.x, this.y - v.y);
    return _v.length;
  }

  distanceToLine(l: Line) {
    return 1;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  projection() {
    return new Vector(this.x, this.y);
  }
}

export interface IVec {
  x: number;
  y: number;

  distanceTo?: (v: IVec) => number;
  distanceToLine?: (l: Line) => number;
}
