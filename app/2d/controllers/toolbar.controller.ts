import CanvasView from "../views/canvas.view";
import CanvasModel from "../models/canvas.model";
import StatsView from "../views/stats.view";
import ToolbarView from "../views/toolbar.view";
import { getProperty } from "../../utils";

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

    if (this.view.subMenus) {
      Array.from(this.view.subMenus).map((e) => {
        e.addEventListener("click", this.handleSubMenu.bind(this));
      });
    }
  }

  handleMenu(e: Event) {
    let cT = e.currentTarget as HTMLElement;
    let value = cT.id;

    switch (value) {
      case "toolbar_selection":
        this.toolbarModel.menu = "default";
        break;
      case "toolbar_heating":
        this.toolbarModel.menu = "heating";
        break;
      case "toolbar_arch":
        this.toolbarModel.menu = "architecture";
        break;
      case "toolbar_ventilation":
        this.toolbarModel.menu = "ventilation";
        break;

      default:
        this.toolbarModel.menu = "default";
    }

    this.view.render();
  }

  handleSubMenu(e: Event) {
    let cT = e.target as HTMLInputElement;
    let value = cT.value;

    // if (isInUnion<Array<"supply" | "return">>(["supply", "return"], value)) {
    //   value;
    //   this.model.updateSubMode(value);
    //   this.view.render();
    // }
  }

  // handleMode(e: Event) {
  //   let cT = e.target as HTMLInputElement;
  //   let value = cT.value;
  //
  //   if (
  //     value === "default" ||
  //     value === "wall" ||
  //     value === "pipe" ||
  //     value === "valve"
  //   ) {
  //     this.model.updateMode(value);
  //   }
  // }
}

export type ToolbarMenu =
  | "default"
  | "architecture"
  | "heating"
  | "ventilation";
export type ToolbarMode = "default" | "wall" | "pipe" | "valve";

const menus: Array<ToolbarMenu> = [
  "heating",
  "architecture",
  "ventilation",
  "default",
];

export default Toolbar;
