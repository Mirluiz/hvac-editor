"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CanvasModel = /** @class */ (function () {
    function CanvasModel() {
        this.mouse = null;
        this.clicked = false;
        this.keyboard = null;
        this.offset = { x: 0, y: 0 };
        this.config = {
            axis: {
                show: true
            },
            net: {
                show: true,
                step: 20
            }
        };
    }
    return CanvasModel;
}());
exports.default = CanvasModel;
