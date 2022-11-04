import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";
import ValveModel from "../models/heating/valve.model";
import ValveGhostModel from "../models/ghost/heating/valve.model";
import { Vector } from "../../geometry/vect";

class Valve {
  canvas: CanvasView;
  ctx: CanvasRenderingContext2D;

  constructor(
    view: CanvasView,
    model: CanvasModel,
    ctx: CanvasRenderingContext2D
  ) {
    this.canvas = view;
    this.ctx = ctx;
  }

  drawGhost(valve: ValveGhostModel) {
    this.ctx.save();
    this.ctx.beginPath();

    let normVector, normVectorReversed;

    if (valve.pipes.length == 0) {
      normVector = new Vector(1, 0);
      normVectorReversed = normVector.reverse();
    } else {
      let valvePipe = valve.pipes[0]; // get one from two pipe for angle detection
      let pipeEnd =
        valvePipe.from.target?.id === valve.id ? valvePipe.from : valvePipe.to;
      let pipeOppositeEnd = pipeEnd.getOpposite();
      normVector = pipeOppositeEnd.vec.sub(pipeEnd.vec).normalize();
      normVectorReversed = normVector.reverse();
    }

    let points = [];

    points.push(
      normVector
        .multiply(valve.width)
        .perpendicular("left")
        .sum(normVector.multiply(valve.length))
        .sum(valve.center),
      normVector
        .multiply(valve.width)
        .perpendicular("right")
        .sum(normVector.multiply(valve.length))
        .sum(valve.center),
      normVector.sum(valve.center),
      normVectorReversed
        .multiply(valve.width)
        .perpendicular("left")
        .sum(normVectorReversed.multiply(valve.length))
        .sum(valve.center),
      normVectorReversed
        .multiply(valve.width)
        .perpendicular("right")
        .sum(normVectorReversed.multiply(valve.length))
        .sum(valve.center),
      normVector.sum(valve.center)
    );

    points.map((p, index) => {
      let wP = this.canvas.model.getLocalCoordinates(p.x, p.y);

      if (index === 0) this.ctx.moveTo(wP.x, wP.y);

      this.ctx.lineTo(wP.x, wP.y);
    });

    this.ctx.lineWidth = 2;
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    let wP = this.canvas.model.getLocalCoordinates(
      valve.center.x,
      valve.center.y
    );
    this.ctx.moveTo(wP.x, wP.y);
    this.ctx.arc(wP.x, wP.y, valve.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.restore();
  }

  drawValves() {
    this.canvas.model.valves.map((v) => {
      this.drawValve(v);
    });
  }

  drawValve(valve: ValveModel) {
    if (valve.pipes.length == 0) return;

    this.ctx.save();
    this.ctx.beginPath();

    let valvePipe = valve.pipes[0]; // get one from two pipe for angle detection
    let pipeEnd =
      valvePipe.from.target?.id === valve.id ? valvePipe.from : valvePipe.to;
    let pipeOppositeEnd = pipeEnd.getOpposite();
    let normVector = pipeOppositeEnd.vec.sub(pipeEnd.vec).normalize();
    let normVectorReversed = normVector.reverse();

    let points = [];

    points.push(
      normVector
        .multiply(valve.width)
        .perpendicular("left")
        .sum(normVector.multiply(valve.length))
        .sum(valve.center),
      normVector
        .multiply(valve.width)
        .perpendicular("right")
        .sum(normVector.multiply(valve.length))
        .sum(valve.center),
      normVector.sum(valve.center),
      normVectorReversed
        .multiply(valve.width)
        .perpendicular("left")
        .sum(normVectorReversed.multiply(valve.length))
        .sum(valve.center),
      normVectorReversed
        .multiply(valve.width)
        .perpendicular("right")
        .sum(normVectorReversed.multiply(valve.length))
        .sum(valve.center),
      normVector.sum(valve.center)
    );

    points.map((p, index) => {
      let wP = this.canvas.model.getLocalCoordinates(p.x, p.y);

      if (index === 0) this.ctx.moveTo(wP.x, wP.y);

      this.ctx.lineTo(wP.x, wP.y);
    });

    this.ctx.lineWidth = 2;
    this.ctx.closePath();
    this.ctx.stroke();

    this.ctx.beginPath();
    let wP = this.canvas.model.getLocalCoordinates(
      valve.center.x,
      valve.center.y
    );
    this.ctx.moveTo(wP.x, wP.y);
    this.ctx.arc(wP.x, wP.y, valve.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fillStyle = "white";
    this.ctx.fill();
    this.ctx.restore();
  }

  draw() {
    this.drawValves();

    if (
      this.canvas.model.placingObject &&
      this.canvas.model.placingObject instanceof ValveGhostModel
    ) {
      this.drawGhost(this.canvas.model.placingObject);
    }
  }
}

export default Valve;
