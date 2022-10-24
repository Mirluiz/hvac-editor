import { default as _2DController } from "./2d";

declare global {
  interface Window {
    app: App;
  }
}

class App {
  _2d: _2DController = new _2DController();

  run() {
    window.app = this;
  }
}

export default App;
