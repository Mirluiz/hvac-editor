class CanvasView {
    container: HTMLCanvasElement | null

    constructor() {
        this.container = document.querySelector("#editor");
        this.init();
    }

    init(){
        if (!this.container)return;

        this.container.style.height = '600px';
        this.container.style.width = '900px';
        this.container.style.border = '1px solid black';
    }

    draw(){
        this.drawNet()
    }

    drawNet() {
        const ctx = this.container?.getContext("2d");

        if (!ctx)return;

    }
}

export default CanvasView;
