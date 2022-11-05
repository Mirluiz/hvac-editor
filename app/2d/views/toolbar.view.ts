import CanvasModel from "../models/canvas.model";
import { ToolbarMenu, ToolbarMode } from "../controllers/toolbar.controller";

class Toolbar {
  model: { menu: ToolbarMenu; subMenu?: string };
  container: HTMLElement | null;
  menu: HTMLElement | null;
  menuItems: NodeListOf<HTMLElement> | null;
  subMenus: NodeListOf<HTMLElement> | null;
  subMenuItems: NodeListOf<HTMLElement> | null;

  constructor(model: { menu: ToolbarMenu; subMenu?: string }) {
    this.model = model;
    this.container = document.querySelector(".toolbar");
    this.menu = document.querySelector(".menu");
    this.menuItems = document.querySelectorAll(".menuItem");
    this.subMenus = document.querySelectorAll(".subMenu");
    this.subMenuItems = document.querySelectorAll(".subMenuItem");
  }

  render() {
    if (!this.subMenus || !this.menu || !this.container) return;

    console.log("clicked", this.model.menu);

    Array.from(this.subMenus).map((subMenu) => {
      subMenu.style.display = "none";
      if (this.model.menu === "default") {
        subMenu.style.display = "none";
      } else {
        console.log(
          ' subMenu.getAttribute("data-tab")',
          subMenu.getAttribute("data-tab"),
          this.model.menu
        );
        if ("toolbar_" + this.model.menu === subMenu.getAttribute("data-tab")) {
          subMenu.style.display = "flex";
        }
        // switch () {
        //   case "toolbar_architecture":
        //     console.log("architecture");
        //     break;
        //   case "toolbar_heating":
        //     console.log("heating");
        //     break;
        //   case "toolbar_ventilation":
        //     console.log("ventilation");
        //     break;
        // }

        // let menuContainer: { [key in ToolbarMenu]: string } = {
        //   default: "toolbar_default",
        //   architecture: "toolbar_arch",
        //   heating: "toolbar_heating",
        //   ventilation: "toolbar_ventilation",
        // };
      }
    });
  }
}

export default Toolbar;
