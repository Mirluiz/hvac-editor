"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wall_model_1 = __importDefault(require("./architecture/wall.model"));
var pipe_model_1 = __importDefault(require("./heating/pipe.model"));
var valve_model_1 = __importDefault(require("./heating/valve.model"));
var Canvas = /** @class */ (function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this.actionMode = "pipe";
        this.actionObject = null;
        this.placingObject = null;
        this.nearestObject = null;
        this.mouse = null;
        this.canvasSize = null;
        this.mouseCanvasRatio = null;
        this.scale = {
            amount: 1,
            coord: null,
            limitReached: false,
        };
        this.clicked = false;
        this.keyboard = null;
        this.offset = { x: 0, y: 0 };
        this.config = {
            axis: {
                show: true,
            },
            net: {
                bind: true,
                show: true,
                step: 20,
            },
        };
    }
    Object.defineProperty(Canvas.prototype, "walls", {
        get: function () {
            return this._walls;
        },
        set: function (value) {
            this._walls = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "pipes", {
        get: function () {
            return this._pipes;
        },
        set: function (value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "valves", {
        get: function () {
            return this._valves;
        },
        set: function (value) {
            this._valves = value;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.addWall = function (start, end) {
        var wall = new wall_model_1.default(start, end);
        wall.color = "black";
        wall.width = 5;
        this.walls.push(wall);
        this.walls = this.walls;
        return wall;
    };
    Canvas.prototype.addPipe = function (start, end) {
        var pipe = new pipe_model_1.default(start, end);
        pipe.color = "red";
        pipe.width = 2;
        this.pipes.push(pipe);
        this.pipes = this.pipes;
        return pipe;
    };
    Canvas.prototype.addValve = function (center) {
        var valve = new valve_model_1.default(center);
        valve.color = "red";
        valve.width = 2;
        this.valves.push(valve);
        this.valves = this.valves;
        return valve;
    };
    return Canvas;
}());
exports.default = Canvas;
