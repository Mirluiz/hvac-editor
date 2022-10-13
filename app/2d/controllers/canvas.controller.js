"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var CanvasController = /** @class */ (function () {
    function CanvasController() {
        this.model = new canvas_model_1.default();
        this.view = new canvas_view_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener('mousemove', this.mouseMove.bind(this));
            this.view.container.addEventListener('mousedown', this.mouseDown.bind(this));
            this.view.container.addEventListener('mouseup', this.mouseUp.bind(this));
        }
    }
    CanvasController.prototype.mouseDown = function (e) {
        this.model.clicked = true;
    };
    CanvasController.prototype.mouseMove = function (e) {
        if (!this.model.mouse) {
            this.model.mouse = {
                x: e.offsetX,
                y: e.offsetY
            };
        }
        else {
            this.model.mouse.x = e.offsetX;
            this.model.mouse.y = e.offsetY;
        }
        if (this.model.clicked) {
            if (this.model.offset) {
                this.model.offset.x += e.movementX;
                this.model.offset.y += e.movementY;
            }
            else {
                this.model.offset = {
                    x: 0,
                    y: 0
                };
            }
        }
        this.view.draw();
    };
    CanvasController.prototype.mouseUp = function (e) {
        this.model.clicked = false;
    };
    return CanvasController;
}());
exports.default = CanvasController;
