"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InfoPanel = /** @class */ (function () {
    function InfoPanel(model) {
        this.model = model;
        this.container = document.querySelector("#infoPanel");
        this.pipeModeFrame = document.querySelector("#pipeModeFrame");
        this.pipeType = document.querySelectorAll("[name='mode-switch-pipe']");
    }
    InfoPanel.prototype.render = function () { };
    return InfoPanel;
}());
exports.default = InfoPanel;
