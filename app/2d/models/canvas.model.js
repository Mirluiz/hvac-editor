"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var valve_model_1 = __importDefault(require("./heating/valve.model"));
var Canvas = /** @class */ (function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this.actionMode = null;
        this.mode = "pipe";
        // actionObject: Wall | Pipe | null = null;
        // placingObject: Valve | null = null;
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
    Canvas.prototype.addWall = function (wall) {
        this.walls.push(wall);
        this.walls = this.walls;
        return wall;
    };
    Canvas.prototype.addPipe = function (pipe) {
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
