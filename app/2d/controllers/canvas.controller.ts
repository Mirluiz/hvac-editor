import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";

class CanvasController {
    view: CanvasView
    model: CanvasModel

    constructor() {
        this.model = new CanvasModel();
        this.view = new CanvasView(this.model)
        if (this.view.container){
            this.view.container.addEventListener('mousemove', this.mouseMove.bind(this));
            this.view.container.addEventListener('mousedown', this.mouseDown.bind(this));
            this.view.container.addEventListener('mouseup', this.mouseUp.bind(this));
        }
    }

    mouseDown(e: Event): void {
        this.model.clicked = true;
    }

    mouseMove(e: MouseEvent): void {


        if (!this.model.mouse){
            this.model.mouse = {
                x: e.offsetX,
                y: e.offsetY
            }
        } else {
            this.model.mouse.x = e.offsetX;
            this.model.mouse.y = e.offsetY;
        }

        if (this.model.clicked){
            if(this.model.offset){
                this.model.offset.x += e.movementX;
                this.model.offset.y += e.movementY;
            } else {
                this.model.offset = {
                    x: 0,
                    y: 0
                }
            }
        }

        this.view.draw();
    }

    mouseUp(e: Event) {
        this.model.clicked = false;
    }

}

export default CanvasController;
