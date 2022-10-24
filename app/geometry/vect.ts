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

  sub(v: IVec) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  angle(v: IVec) {
    return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
  }

  // dot(a: IVec): number {
  //   return a.x * this.x + a.y * this.y;
  // }
  //
  // cross(a: IVec): number {
  //   return 1;
  // }
}

export interface IVec extends ICoord {
  length: number;
  distanceTo: (v: IVec) => number;
  sub: (v: IVec) => IVec;
  distanceToLine: (l: Line) => number;
  angle: (v: IVec) => number;
}

export interface ICoord {
  x: number;
  y: number;
}
