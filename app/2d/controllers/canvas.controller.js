"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var stats_view_1 = __importDefault(require("../views/stats.view"));
var pipe_model_1 = __importDefault(require("../models/heating/pipe.model"));
var vect_1 = require("../../geometry/vect");
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
                this.pipeLaying(_mouse);
                break;
            case "valve":
                break;
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
        var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        if (this.model.config.net.bind) {
            _mouse.x =
                Math.round(_mouse.x / this.model.config.net.step) *
                    this.model.config.net.step;
            _mouse.y =
                Math.round(_mouse.y / this.model.config.net.step) *
                    this.model.config.net.step;
        }
        this.actionModeUpdate(_mouse);
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseUp = function (e) {
        this.model.clicked = false;
    };
    Canvas.prototype.keyUp = function (e) {
        console.log("e", e.code, e);
        if (e.key === "Escape") {
            console.log("----");
            this.model.actionMode = null; // Todo: future reset place here;
            this.reset();
        }
    };
    Canvas.prototype.pipeLaying = function (coord) {
        var lastPipe = this.model.pipes[this.model.pipes.length - 1];
        if (!this.model.actionMode) {
            console.log("----");
            this.model.actionMode = "pipeLaying";
            var p = new pipe_model_1.default(new vect_1.Vector(coord.x, coord.y), new vect_1.Vector(coord.x, coord.y));
            p.temp = true;
            this.model.addPipe(p);
        }
        else {
            if (lastPipe) {
                lastPipe.temp = false;
                var p = new pipe_model_1.default(lastPipe.end, coord);
                p.temp = true;
                this.model.addPipe(p);
            }
            else
                console.warn("something wrong");
        }
    };
    Canvas.prototype.actionModeUpdate = function (_mouse) {
        switch (this.model.actionMode) {
            case "pipeLaying":
                var lastPipe = this.model.pipes[this.model.pipes.length - 1];
                lastPipe.end.x = _mouse.x;
                lastPipe.end.y = _mouse.y;
                console.log("lastPipe", lastPipe);
                break;
            case "wallLaying":
                break;
        }
    };
    Canvas.prototype.reset = function () {
        this.model.pipes = this.model.pipes.filter(function (p) { return !p.temp; });
        this.stats.render();
        this.view.draw();
    };
    return Canvas;
}());
exports.default = Canvas;
