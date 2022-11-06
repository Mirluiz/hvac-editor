import CanvasModel from "../models/canvas.model";
import CanvasView from "./canvas.view";
import { IVec, Vector } from "../../geometry/vect";
import RadiatorModel from "../models/heating/radiator.model";
import RadiatorGhostModel from "../models/ghost/heating/radiator.model";

class Radiator {
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

  drawRadiators() {
    this.canvas.model.radiators.map((radiator) => {
      this.drawRadiator(radiator);
    });
  }

  drawRadiator(radiator: RadiatorModel) {
    this.ctx.save();
    this.ctx.beginPath();

    let toCenter = radiator.objectCenter.sum(radiator.center);

    let wP = this.canvas.model.getLocalCoordinates(
      radiator.center.x,
      radiator.center.y
    );

    this.ctx.rect(toCenter.x, toCenter.y, radiator.width, radiator.height);
    this.ctx.stroke();
    this.ctx.restore();

    radiator.IOs.map((io) => {
      let toCenter = io.getVecAbs();
      let wP = this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);

      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.strokeStyle = "red";
      this.ctx.arc(wP.x, wP.y, 5, 0, 2 * Math.PI);
      this.ctx.fillStyle = io.type === "supply" ? "red" : "blue";
      this.ctx.fill();
      this.ctx.restore();
    });
  }

  drawGhost(radiator: RadiatorGhostModel) {
    this.ctx.save();
    this.ctx.beginPath();

    let toCenter = new Vector(-radiator.width / 2, -radiator.height / 2).sum(
      radiator.center
    );

    let wP = this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);

    this.ctx.strokeStyle = "red";
    this.ctx.rect(wP.x, wP.y, radiator.width, radiator.height);
    this.ctx.stroke();
    this.ctx.restore();

    radiator.IOs.map((io) => {
      let toCenter = new Vector(-radiator.width / 2, -radiator.height / 2).sum(
        radiator.center.sum(io.vec)
      );

      let wP = this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);

      // this.ctx.save();
      // this.ctx.beginPath();
      // this.ctx.strokeStyle = "red";
      // this.ctx.arc(wP.x, wP.y, 5, 0, 2 * Math.PI);
      // this.ctx.fillStyle = io.type === "supply" ? "red" : "blue";
      // this.ctx.fill();
      // this.ctx.restore();
    });
  }

  draw() {
    this.drawRadiators();

    if (
      this.canvas.model.placingObject &&
      this.canvas.model.placingObject instanceof RadiatorGhostModel
    ) {
      this.drawGhost(this.canvas.model.placingObject);
    }
  }
}

export default Radiator;
