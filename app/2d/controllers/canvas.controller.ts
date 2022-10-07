import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";

class CanvasController {
    view: CanvasView
    model: CanvasModel

    constructor() {
        this.view = new CanvasView();
        this.model = new CanvasModel();
    }

    mouseMove(){
        this.view.draw();
    }

    mouseDown(){

    }

    mouseUp(){

    }
}

export default CanvasController;
