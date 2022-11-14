"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _2d_1 = __importDefault(require("./2d"));
var App = /** @class */ (function () {
    function App() {
        this._2d = new _2d_1.default();
        // step() {
        //   this._2d.canvas.view.draw();
        //   window.requestAnimationFrame(this.step.bind(this));
        // }
    }
    App.prototype.run = function () {
        window.app = this;
        this._2d.canvas.view.init();
        // window.requestAnimationFrame(this.step.bind(this));
    };
    return App;
}());
exports.default = App;
