"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_controller_1 = __importDefault(
  require("./controllers/canvas.controller")
);
var toolbar_controller_1 = __importDefault(
  require("../ui/controller/toolbar.controller")
);
var info_panel_controller_1 = __importDefault(
  require("../ui/controller/info-panel.controller")
);
var Controller = /** @class */ (function () {
  function Controller() {
    this.canvas = new canvas_controller_1.default();
    this.toolbar = new toolbar_controller_1.default(this.canvas.model);
    this.infoPanel = new info_panel_controller_1.default(this.canvas.model);
    this.canvas.model.update();
  }
  return Controller;
})();
exports.default = Controller;
