import CanvasModel from "../../app/2d/models/canvas.model";
import ToolbarView from "../view/toolbar.view";

class Toolbar {
  view: ToolbarView;
  model: CanvasModel;
  toolbarModel: { menu: ToolbarMenu; subMenu?: string } = { menu: "default" }; // now it is small object. if it gets bigger move it

  constructor(model: CanvasModel) {
    this.model = model;
    this.view = new ToolbarView(this.toolbarModel);

    if (this.view.menuItems) {
      Array.from(this.view.menuItems).map((e) => {
        e.addEventListener("click", this.handleMenu.bind(this));
      });
    }

    if (this.view.subMenuItems) {
      Array.from(this.view.subMenuItems).map((e) => {
        e.addEventListener("click", this.handleMode.bind(this));
      });
    }
  }

  handleMenu(e: Event) {
    let cT = e.currentTarget as HTMLElement;
    let value = cT.id;

    switch (value) {
      case "toolbar_selection":
        this.model.updateMode("default");
        this.toolbarModel.menu = "default";
        break;
      case "toolbar_heating":
        this.toolbarModel.menu = "heating";
        break;
      case "toolbar_architecture":
        this.toolbarModel.menu = "architecture";
        break;
      case "toolbar_ventilation":
        this.toolbarModel.menu = "ventilation";
        break;
      default:
        this.model.updateMode("default");
        this.toolbarModel.menu = "default";
    }

    this.view.render();
  }

  handleMode(e: Event) {
    let cT = e.currentTarget as HTMLInputElement;
    let value = cT.getAttribute("data-value");

    if (
      value === "default" ||
      value === "wall" ||
      value === "pipe" ||
      value === "radiator" ||
      value === "valve"
    ) {
      this.model.updateMode(value);
    }
  }
}

export type ToolbarMenu =
  | "default"
  | "architecture"
  | "heating"
  | "ventilation";
export type ToolbarMode = "default" | "wall" | "pipe" | "valve" | "radiator";

export default Toolbar;
