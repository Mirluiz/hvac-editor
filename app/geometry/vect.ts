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

  distanceToLine(l: Line): number {
    let lVec = l.end.sub(l.start);
    let vec = this.sub(l.start);
    let angle = vec.angle(lVec);

    let p = lVec.product(vec);
    let p1 = vec.product(vec);

    let param = -1;

    if (p !== 0) param = p1 / p;

    if (param < 0) {
      return vec.length;
    } else if (param > 1) {
      return lVec.sub(vec).length;
    }

    return Math.sin(angle) * vec.length;
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  projection(b: IVec) {
    return this.product(b) / Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  sub(v: IVec): Vector {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  sum(v: IVec): Vector {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  angle(v: IVec) {
    return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
  }

  product(v: IVec): number {
    return this.x * v.x + this.y * v.y;
  }

  normalize() {
    return new Vector(this.x / this.length, this.y / this.length);
  }

  multiply(a: number) {
    return new Vector(this.x * a, this.y * a);
  }

  clone() {
    return new Vector(this.x, this.y);
  }
}

export interface IVec extends ICoord {
  length: number;
  distanceTo: (v: IVec) => number;
  sub: (v: IVec) => IVec;
  sum: (v: IVec) => IVec;
  distanceToLine: (l: Line) => number;
  angle: (v: IVec) => number;
  projection: (v: IVec) => number;
  normalize: () => Vector;
  multiply: (n: number) => IVec;
  product: (v: IVec) => number;
  clone: () => IVec;
}

export interface ICoord {
  x: number;
  y: number;
}
