"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mode_view_1 = __importDefault(require("../views/mode.view"));
var Mode = /** @class */ (function () {
    function Mode(model) {
        this.model = model;
        this.view = new mode_view_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener("click", this.handleMode.bind(this));
        }
        if (this.view.subContainer) {
            this.view.subContainer.addEventListener("click", this.handleSubMode.bind(this));
        }
    }
    Mode.prototype.handleMode = function (e) {
        var cT = e.target;
        var value = cT.value;
        if (value === "default" ||
            value === "wall" ||
            value === "pipe" ||
            value === "valve") {
            this.model.mode = value;
        }
    };
    Mode.prototype.handleSubMode = function (e) {
        var cT = e.target;
        var value = cT.value;
        if (value === "supply" || value === "return") {
            this.model.subMode = value;
        }
    };
    return Mode;
}());
exports.default = Mode;
