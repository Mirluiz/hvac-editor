"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Toolbar = /** @class */ (function () {
    function Toolbar(model) {
        this.model = model;
        this.container = document.querySelector(".toolbar");
        this.menu = document.querySelector(".toolbar");
        this.subMenu = document.querySelector(".toolbar");
    }
    Toolbar.prototype.render = function () {
        if (!this.subMenu || !this.menu || !this.container)
            return;
        if (this.model.menu === "default") {
            this.subMenu.style.display = "none";
        }
        else {
            this.subMenu.style.display = "flex";
            this.subMenu.style.display = "flex";
            var subMenuItem = document.querySelector(".subMenuItem");
            if (subMenuItem) {
                subMenuItem.style.display = "none";
            }
            var menuContainer = {
                default: "toolbar_arch",
                architecture: "toolbar_",
                heating: "toolbar_heating",
                ventilation: "toolbar_arch",
            };
            this.subMenu.children;
        }
    };
    return Toolbar;
}());
exports.default = Toolbar;
