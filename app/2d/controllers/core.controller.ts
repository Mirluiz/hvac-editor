import CanvasController from "./canvas.controller";

class CoreController {
    canvas: CanvasController = new CanvasController()

    mouseMove(){
        this.canvas.mouseMove();
    }
}

export default CoreController
