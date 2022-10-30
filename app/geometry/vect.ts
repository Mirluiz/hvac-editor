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
    let ret: number;
    let lVec = l.to.vec.sub(l.from.vec);
    let vec = this.sub(l.from.vec);
    let angle = vec.angle(lVec);

    if (vec.length === 0) console.warn("ops");

    let p = lVec.product(vec);
    let p1 = vec.product(vec);

    let param = -1;

    if (p !== 0) param = p1 / p;

    if (param < 0) {
      ret = Math.round(vec.length);
    } else if (param > 1) {
      ret = Math.round(lVec.sub(vec).length);
    } else {
      ret = Math.round(Math.sin(angle) * vec.length);
    }

    return ret;
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

  angle(v: IVec | undefined = undefined) {
    if (v) {
      // return Math.atan2(
      //   this.x * v.y - this.y * v.x,
      //   this.x * v.x + this.y * v.y
      // );

      return Math.acos(
        (this.x * v.x + this.y * v.y) / (this.length * v.length)
      );
    }

    return Math.atan2(this.y, this.x);
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

  perpendicular() {
    return new Vector(this.y, -this.x);
  }

  clone() {
    return new Vector(this.x, this.y);
  }

  bindNet(step: number) {
    return new Vector(
      Math.round(this.x / step) * step,
      Math.round(this.y / step) * step
    );
  }

  drawVector() {
    //debug only
    setTimeout(() => {
      let container: HTMLCanvasElement | null =
        document.querySelector("#editor");

      if (container) {
        const ctx = container.getContext("2d");

        if (!ctx) return;
        ctx.save();
        ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
      }
    }, 0);
  }
}

export interface IVec extends ICoord {
  length: number;
  distanceTo: (v: IVec) => number;
  sub: (v: IVec) => IVec;
  sum: (v: IVec) => IVec;
  distanceToLine: (l: Line) => number;
  angle: (v?: IVec) => number;
  projection: (v: IVec) => number;
  normalize: () => Vector;
  multiply: (n: number) => IVec;
  product: (v: IVec) => number;
  clone: () => IVec;
  bindNet: (step: number) => IVec;
  drawVector: () => void;
}

export interface ICoord {
  x: number;
  y: number;
}
