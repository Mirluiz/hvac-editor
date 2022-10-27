import CanvasModel from "../models/canvas.model";

class Stats {
  model: CanvasModel;
  container: HTMLElement | null;

  constructor(model: CanvasModel) {
    this.model = model;
    this.container = document.querySelector("#stats");
    this.init();
  }

  init() {
    this.initContainer();
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div style="display: flex; flex-direction: column">
        <div>x - ${Math.round(this.model.offset.x)} 
        / y - ${Math.round(this.model.offset.y)}</div>
        
        <div>x - ${Math.round(this.model.mouse?.x ?? 0)} 
        / y - ${Math.round(this.model.mouse?.y ?? 0)}</div>
        
        <div>scale - ${this.model.scale.amount}</div>
        <div>width - ${this.model.canvasSize?.x} / height - ${
      this.model.canvasSize?.y
    } / </div>
        <div>ratio x ${this.model.mouseCanvasRatio?.x} / y ${
      this.model.mouseCanvasRatio?.y
    }</div>
        <div>mode is ${this.model.actionMode}</div>
      </div>
      
      </div>
        <div>fitting size is ${this.model.fittings.length}</div>
        <div>pipes size is ${this.model.pipes.length}</div>
      </div>
      </div>
        <div>hovered object ${
          this.model.getPipeByID(
            this.model.overlap.list.length > 0 && this.model.overlap.list[0].id
              ? this.model.overlap.list[0].id
              : ""
          )?.id
        }</div>
        <div>pipes size is ${this.model.pipes.length}</div>
      </div>
    `;
  }

  initContainer(): void {
    if (!this.container) return;

    this.container.style.height = "450px";
    this.container.style.width = "300px";
    this.container.style.border = "1px solid black";
    this.container.style.marginLeft = "10px";
  }
}

export default Stats;
