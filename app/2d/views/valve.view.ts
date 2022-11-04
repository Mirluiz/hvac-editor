import CanvasModel from "../models/canvas.model";
import PipeModel from "../models/heating/pipe.model";
import CanvasView from "./canvas.view";
import ValveModel from "../models/heating/valve.model";
import ValveGhostModel from "../models/ghost/heating/valve.model";

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

    this.ctx.save();
    this.ctx.beginPath();

    let c = this.canvas.model.getLocalCoordinates(
      valve.center.x,
      valve.center.y
    );

    this.ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);

    this.ctx.fillStyle = "grey";

    this.ctx.fill();
    this.ctx.restore();

    this.ctx.stroke();
    this.ctx.restore();
  }

  drawValves() {
    this.canvas.model.valves.map((v) => {
      this.drawValve(v);
    });
  }

  drawValve(valve: ValveModel) {
    this.ctx.save();
    this.ctx.beginPath();

    let c = this.canvas.model.getLocalCoordinates(
      valve.center.x,
      valve.center.y
    );

    this.ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);

    this.ctx.fillStyle = valve.color;

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
