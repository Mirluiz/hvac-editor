"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_controller_1 = __importDefault(require("./controllers/canvas.controller"));
var Controller = /** @class */ (function () {
    function Controller() {
        this.canvas = new canvas_controller_1.default();
    }
    return Controller;
}());
exports.default = Controller;