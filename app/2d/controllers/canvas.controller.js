"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var stats_view_1 = __importDefault(require("../views/stats.view"));
var vect_1 = require("../../geometry/vect");
var pipe_controller_1 = __importDefault(require("./pipe.controller"));
var object_controller_1 = __importDefault(require("./object.controller"));
var Canvas = /** @class */ (function () {
    function Canvas() {
        this.model = new canvas_model_1.default();
        this.view = new canvas_view_1.default(this.model);
        this.stats = new stats_view_1.default(this.model);
        this.pipe = new pipe_controller_1.default(this.model);
        this.object = new object_controller_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener("mousemove", this.mouseMove.bind(this));
            this.view.container.addEventListener("mousedown", this.mouseDown.bind(this));
            this.view.container.addEventListener("mouseup", this.mouseUp.bind(this));
            this.view.container.addEventListener("wheel", this.mouseWheel.bind(this));
            document.addEventListener("keyup", this.keyUp.bind(this));
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
        var worldCoord = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        var _mouse = new vect_1.Vector(worldCoord.x, worldCoord.y);
        if (this.model.config.net.bind) {
            _mouse.x =
                Math.round(_mouse.x / this.model.config.net.step) *
                    this.model.config.net.step;
            _mouse.y =
                Math.round(_mouse.y / this.model.config.net.step) *
                    this.model.config.net.step;
        }
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseDown();
                break;
            case "radiator":
            case "valve":
                this.object.mouseDown();
                break;
        }
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseMove = function (e) {
        if (!this.model.mouse || !this.model.netBoundMouse) {
            this.model.mouse = {
                x: e.offsetX,
                y: e.offsetY,
            };
            this.model.netBoundMouse = {
                x: e.offsetX,
                y: e.offsetY,
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
                    y: 0,
                };
            }
        }
        this.model.netBoundMouse.x =
            Math.round(this.model.mouse.x / this.model.config.net.step) *
                this.model.config.net.step;
        this.model.netBoundMouse.y =
            Math.round(this.model.mouse.y / this.model.config.net.step) *
                this.model.config.net.step;
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseMove();
                break;
            case "radiator":
            case "valve":
                this.object.mouseMove();
                break;
        }
        this.model.overlap.update();
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseUp = function (e) {
        this.model.clicked = false;
        if (!this.model.mouse)
            return;
        var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        if (this.model.config.net.bind) {
            _mouse.x =
                Math.round(_mouse.x / this.model.config.net.step) *
                    this.model.config.net.step;
            _mouse.y =
                Math.round(_mouse.y / this.model.config.net.step) *
                    this.model.config.net.step;
        }
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseUp(_mouse);
                break;
            case "valve":
                this.object.mouseUp(_mouse);
                break;
        }
    };
    Canvas.prototype.keyUp = function (e) {
        if (e.key === "Escape") {
            this.model.actionMode = null; // Todo: future reset place here;
            this.reset();
        }
    };
    Canvas.prototype.reset = function () {
        this.model.actionObject = null;
        document.body.style.cursor = "default";
        this.stats.render();
        this.view.draw();
    };
    return Canvas;
}());
exports.default = Canvas;
