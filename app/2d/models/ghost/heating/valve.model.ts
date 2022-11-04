import { IVec, Vector } from "../../../../geometry/vect";
import CanvasModel from "../../canvas.model";
import Arc from "../../geometry/arc.model";
import overlapModel from "../../../overlap.model";

class Valve extends Arc {
  model: CanvasModel;

  constructor(model: CanvasModel, center: IVec) {
    super(center);

    this.model = model;
  }

  validation(): boolean {
    let overlaps = this.model.overlap.pipeOverlap(this.center);

    return overlaps.length > 0 && !overlaps.find((o) => o.pipe);
  }
}

export default Valve;
