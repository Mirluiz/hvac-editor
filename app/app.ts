import { default as _2DController } from "./2d";
import { m3 } from "./math/m3";

declare global {
  interface Window {
    app: App;
  }
}

class App {
  _2d: _2DController = new _2DController();

  run() {
    window.app = this;

    this._2d.canvas.view.init();
    this._2d.canvas.view.drawScene();
    window.requestAnimationFrame(this.step.bind(this));
  }

  step() {
    this._2d.canvas.view.drawScene();
    window.requestAnimationFrame(this.step.bind(this));
  }
}

export default App;
