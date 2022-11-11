"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var info_panel_view_1 = __importDefault(require("../view/info-panel.view"));
var InfoPanel = /** @class */ (function () {
    function InfoPanel(model) {
        var _this = this;
        this.panelModel = {};
        this.model = model;
        this.view = new info_panel_view_1.default(this.panelModel);
        if (this.view.pipeModeFrame) {
            this.view.pipeModeFrame.addEventListener("click", this.pipeModeHandle.bind(this));
        }
        if (this.view.pipeType) {
            this.view.pipeType.forEach(function (e) {
                e.addEventListener("change", _this.pipeTypeHandle.bind(_this));
            });
        }
    }
    InfoPanel.prototype.pipeModeHandle = function () { };
    InfoPanel.prototype.pipeTypeHandle = function (e) {
        var cT = e.currentTarget;
        var value = cT.value;
        if (value === "supply" || value === "return") {
            this.model.updateSubMode(value);
        }
    };
    return InfoPanel;
}());
exports.default = InfoPanel;
