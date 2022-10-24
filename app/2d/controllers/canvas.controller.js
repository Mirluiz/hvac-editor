"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var stats_view_1 = __importDefault(require("../views/stats.view"));
var line_model_1 = __importDefault(require("../models/geometry/line.model"));
var Canvas = /** @class */ (function () {
    function Canvas() {
        this.model = new canvas_model_1.default();
        this.view = new canvas_view_1.default(this.model);
        this.stats = new stats_view_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener("mousemove", this.mouseMove.bind(this));
            this.view.container.addEventListener("mousedown", this.mouseDown.bind(this));
            this.view.container.addEventListener("mouseup", this.mouseUp.bind(this));
            this.view.container.addEventListener("wheel", this.mouseWheel.bind(this));
        }
    }
    Canvas.prototype.mouseWheel = function (e) {
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseDown = function (e) {
        this.model.clicked = true;
        if (!this.model.mouse)
            return;
        if (!this.model.actionObject) {
            var _mouse = { x: this.model.mouse.x, y: this.model.mouse.y };
            if (this.model.config.net.bind) {
                _mouse.x =
                    Math.round(_mouse.x / this.model.config.net.step) *
                        this.model.config.net.step;
                _mouse.y =
                    Math.round(_mouse.y / this.model.config.net.step) *
                        this.model.config.net.step;
            }
            switch (this.model.actionMode) {
                case "wall":
                    this.model.actionObject = this.model.addWall({
                        x: _mouse.x,
                        y: _mouse.y,
                    }, {
                        x: _mouse.x,
                        y: _mouse.y,
                    });
                    break;
                case "pipe":
                    this.model.actionObject = this.model.addPipe({
                        x: _mouse.x,
                        y: _mouse.y,
                    }, {
                        x: _mouse.x,
                        y: _mouse.y,
                    });
                    break;
            }
        }
        else {
            this.model.actionObject = null;
        }
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseMove = function (e) {
        if (!this.model.mouse) {
            this.model.mouse = {
                x: e.offsetX,
                y: e.offsetY,
            };
        }
        else {
            this.model.mouse.x = e.offsetX;
            this.model.mouse.y = e.offsetY;
        }
        if (this.model.actionObject) {
            if (this.model.actionObject instanceof line_model_1.default) {
                var _mouse = { x: this.model.mouse.x, y: this.model.mouse.y };
                if (this.model.config.net.bind) {
                    _mouse.x =
                        Math.round(_mouse.x / this.model.config.net.step) *
                            this.model.config.net.step;
                    _mouse.y =
                        Math.round(_mouse.y / this.model.config.net.step) *
                            this.model.config.net.step;
                }
                this.model.actionObject.end.x = _mouse.x;
                this.model.actionObject.end.y = _mouse.y;
            }
        }
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseUp = function (e) {
        this.model.clicked = false;
    };
    return Canvas;
}());
exports.default = Canvas;
