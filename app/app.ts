import CoreController from "./2d/controllers/core.controller";

class App {
  controller2D: CoreController

  constructor() {
    this.controller2D = new CoreController();
  }

  run() {}
}

export default App
