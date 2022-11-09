"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var toolbar_view_1 = __importDefault(require("../view/toolbar.view"));
var Toolbar = /** @class */ (function () {
  function Toolbar(model) {
    var _this = this;
    this.toolbarModel = { menu: "default" }; // now it is small object. if it gets bigger move it
    this.model = model;
    this.view = new toolbar_view_1.default(this.toolbarModel);
    if (this.view.menuItems) {
      Array.from(this.view.menuItems).map(function (e) {
        e.addEventListener("click", _this.handleMenu.bind(_this));
      });
    }
    if (this.view.subMenuItems) {
      Array.from(this.view.subMenuItems).map(function (e) {
        e.addEventListener("click", _this.handleMode.bind(_this));
      });
    }
  }
  Toolbar.prototype.handleMenu = function (e) {
    var cT = e.currentTarget;
    var value = cT.id;
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
  };
  Toolbar.prototype.handleMode = function (e) {
    var cT = e.currentTarget;
    var value = cT.getAttribute("data-value");
    if (
      value === "default" ||
      value === "wall" ||
      value === "pipe" ||
      value === "radiator" ||
      value === "valve"
    ) {
      this.model.updateMode(value);
    }
  };
  return Toolbar;
})();
exports.default = Toolbar;
