import { IVec } from "../../geometry/vect";

class CanvasModel {
  mouse: IVec | null = null;
  canvasSize: IVec | null = null;
  mouseCanvasRatio: IVec | null = null;
  scale: {
    amount: number;
    coord: IVec | null;
    limitReached: boolean;
  } = {
    amount: 1,
    coord: null,
    limitReached: false,
  };
  clicked: boolean = false;
  keyboard: string | null = null;
  offset: IVec = { x: 0, y: 0 };
  config: IConfig = {
    axis: {
      show: true,
    },
    net: {
      show: true,
      step: 20,
    },
  };
}

interface IConfig {
  axis: {
    show: boolean;
  };
  net: {
    show: boolean;
    step: 15 | 20 | 50;
  };
}

export default CanvasModel;
