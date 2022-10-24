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
        console.log(this.view);
        if (this.view.container) {
            this.view.container.addEventListener("click", this.mouseDown.bind(this));
        }
    }
    Mode.prototype.mouseDown = function (e) {
        var cT = e.target;
        var value = cT.value;
        if (value === "default" ||
            value === "wall" ||
            value === "pipe" ||
            value === "valve") {
            this.model.actionMode = value;
        }
    };
    return Mode;
}());
exports.default = Mode;
