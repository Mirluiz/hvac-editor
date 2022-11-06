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

  angle1(v: IVec) {
    return Math.atan2(this.x * v.y - v.x * this.y, this.x * v.x + this.y * v.y);
  }

  product(v: IVec): number {
    return this.x * v.x + this.y * v.y;
  }

  normalize() {
    if (this.length === 0) {
      console.warn("v is zero");
      new Vector(0, 0);
    }
    return new Vector(this.x / this.length, this.y / this.length);
  }

  multiply(a: number) {
    return new Vector(this.x * a, this.y * a);
  }

  perpendicular(side: "left" | "right" = "left") {
    if (side === "left") {
      return new Vector(this.y, -this.x);
    } else {
      return new Vector(-this.y, this.x);
    }
  }

  reverse() {
    return new Vector(-this.x, -this.y);
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
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
      }
    }, 0);
  }

  rotate(angle: number, around: IVec | undefined = undefined) {
    let { x, y } = this;
    angle *= Math.PI / 180;

    if (around) {
      x = this.x - around.x;
      y = this.y - around.y;
    }

    let v = new Vector(
      x * Math.cos(angle) - y * Math.sin(angle),
      x * Math.sin(angle) + y * Math.cos(angle)
    );

    if (around) {
      v = v.sum(around);
    }

    return v;
  }

  scalar(v: IVec) {
    return this.x * v.x + this.y * v.y;
  }
}

export interface IVec extends ICoord {
  length: number;
  distanceTo: (v: IVec) => number;
  sub: (v: IVec) => IVec;
  sum: (v: IVec) => IVec;
  distanceToLine: (l: Line) => number;
  perpendicular: (side: "left" | "right") => IVec;
  reverse: () => IVec;
  angle: (v?: IVec) => number;
  angle1: (v: IVec) => number;
  projection: (v: IVec) => number;
  normalize: () => Vector;
  multiply: (n: number) => IVec;
  product: (v: IVec) => number;
  clone: () => IVec;
  bindNet: (step: number) => IVec;
  drawVector: () => void;
  rotate: (angle: number, around?: IVec) => IVec;
  scalar: (v: IVec) => number;
}

export interface ICoord {
  x: number;
  y: number;
}
