import CanvasModel from "../../app/2d/models/canvas.model";
import { ToolbarMenu, ToolbarMode } from "../controller/toolbar.controller";

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
    if (!this.subMenus || !this.menu || !this.menuItems || !this.container)
      return;

    Array.from(this.menuItems).map((menu) => {
      if ("toolbar_" + this.model.menu === menu.id) {
        menu.style.background = "cadetblue";
      } else {
        menu.style.background = "black";
      }
    });

    Array.from(this.subMenus).map((subMenu) => {
      subMenu.style.display = "none";
      if (this.model.menu === "default") {
        subMenu.style.display = "none";
      } else {
        if ("toolbar_" + this.model.menu === subMenu.getAttribute("data-tab")) {
          subMenu.style.display = "flex";
        }
      }
    });
  }
}

export default Toolbar;
