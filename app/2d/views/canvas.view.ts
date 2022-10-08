import {IVec} from "../../Geometry/vect";
import CanvasModel from "../models/canvas.model";

class CanvasView {
    model: CanvasModel
    container: HTMLCanvasElement | null

    constructor(model: CanvasModel) {
        this.model = model;
        this.container = document.querySelector("#editor");
        this.init();
    }

    init(){
        this.initCanvasContainer();
    }

    draw(){
        this.clear();
        this.drawNet()
        this.drawMouse()
    }

    clear(){
        const ctx = this.container?.getContext("2d");

        if (!ctx || !this.model.mouse || !this.container)return;

        ctx.clearRect(0, 0, this.container.width, this.container.height);
    }

    drawMouse(){
        const ctx = this.container?.getContext("2d");

        if (!ctx || !this.model.mouse)return;

        ctx.save();

        ctx.beginPath();
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        ctx.arc(this.model.mouse.x, this.model.mouse.y, 1, 0, 2 * Math.PI);

        ctx.restore();
    }

    drawNet() {
        const ctx = this.container?.getContext("2d");

        if (!ctx || !this.model.mouse || !this.container)return;
        if (!this.model.config.net.show)return;

        ctx.save();

        ctx.beginPath();
        ctx.lineWidth = 1;

        let step = this.model.config.net.step;
        let h = this.container.height;
        let w = this.container.width;

        let iV = 0;
        let maxV = w/step
        while (iV < maxV){
            let from = this.getGlobalCoordinates(step * iV, 0);
            let to = this.getGlobalCoordinates(step * iV, h);

            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);

            iV++;
        }

        let iH = 0;
        let maxH = h/step
        while (iH < maxH) {
            let from = this.getGlobalCoordinates(0, step * iH);
            let to = this.getGlobalCoordinates(w, step * iH);

            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);

            iH++;
        }

        ctx.stroke();

        ctx.restore();

    }

    drawAxis() {
        const ctx = this.container?.getContext("2d");

        if (!ctx || !this.model.mouse || !this.container)return;
        if (!this.model.config.net.show)return;

        ctx.save();

        ctx.beginPath();

        let step = this.model.config.net.step;
        let h = this.container.height;
        let w = this.container.width;
        let _i = 0;
        let _max = this.container.width/step
        while (_i < _max){

            ctx.moveTo(step * _i, 0);
            ctx.lineTo(step * _i, h);

            _i++;
        }
        ctx.stroke();

        ctx.restore();
    }

    getGlobalCoordinates(x: number, y: number): IVec {
        return {
            x: x + this.model.offset.x,
            y: y + this.model.offset.y,
        }
    }


    initCanvasContainer(): void {
        if (!this.container)return;

        this.container.style.height = '600px';
        this.container.style.width = '900px';
        this.container.height = 600;
        this.container.width = 900;
        this.container.style.border = '1px solid black';
    }
}

export default CanvasView;
