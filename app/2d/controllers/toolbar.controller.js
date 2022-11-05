"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var toolbar_view_1 = __importDefault(require("../views/toolbar.view"));
var utils_1 = require("../../utils");
var Toolbar = /** @class */ (function () {
    function Toolbar(model) {
        this.toolbarModel = { menu: "default" }; // now it is small object. if it gets bigger move it
        this.model = model;
        this.view = new toolbar_view_1.default(this.toolbarModel);
        if (this.view.menu) {
            this.view.menu.addEventListener("click", this.handleMenu.bind(this));
        }
        if (this.view.subMenu) {
            this.view.subMenu.addEventListener("click", this.handleSubMenu.bind(this));
        }
    }
    Toolbar.prototype.handleMenu = function (e) {
        var cT = e.target;
        var value = cT.value;
        if ((0, utils_1.isInUnion)(value)) {
            this.toolbarModel.menu = value;
            this.view.render();
        }
    };
    Toolbar.prototype.handleSubMenu = function (e) {
        var cT = e.target;
        var value = cT.value;
        if ((0, utils_1.isInUnion)(value)) {
            this.model.updateSubMode(value);
            this.view.render();
        }
    };
    return Toolbar;
}());
exports.default = Toolbar;
