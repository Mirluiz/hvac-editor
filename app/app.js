"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _2d_1 = __importDefault(require("./2d"));
var m3_1 = require("./math/m3");
var App = /** @class */ (function () {
    function App() {
        this._2d = new _2d_1.default();
    }
    App.prototype.run = function () {
        window.app = this;
        var a = [1, 2, 3, 12, 3, 4, 55, 5, 5];
        var b = [55, -1, 99, 14, 5, 6, 34, 23, -5];
        var m = m3_1.m3.multiply(a, b);
        console.log("m", m);
        // this._2d.canvas.view.init();
        // this._2d.canvas.view.drawScene();
        // window.requestAnimationFrame(this.step.bind(this));
    };
    App.prototype.step = function () {
        this._2d.canvas.view.drawScene();
        window.requestAnimationFrame(this.step.bind(this));
    };
    return App;
}());
exports.default = App;
