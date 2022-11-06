"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Toolbar = /** @class */ (function () {
    function Toolbar(model) {
        this.model = model;
        this.container = document.querySelector(".toolbar");
        this.menu = document.querySelector(".menu");
        this.menuItems = document.querySelectorAll(".menuItem");
        this.subMenus = document.querySelectorAll(".subMenu");
        this.subMenuItems = document.querySelectorAll(".subMenuItem");
    }
    Toolbar.prototype.render = function () {
        var _this = this;
        if (!this.subMenus || !this.menu || !this.menuItems || !this.container)
            return;
        Array.from(this.menuItems).map(function (menu) {
            if ("toolbar_" + _this.model.menu === menu.id) {
                menu.style.background = "cadetblue";
            }
            else {
                menu.style.background = "black";
            }
        });
        Array.from(this.subMenus).map(function (subMenu) {
            subMenu.style.display = "none";
            if (_this.model.menu === "default") {
                subMenu.style.display = "none";
            }
            else {
                if ("toolbar_" + _this.model.menu === subMenu.getAttribute("data-tab")) {
                    subMenu.style.display = "flex";
                }
            }
        });
    };
    return Toolbar;
}());
exports.default = Toolbar;
