"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var pipe_model_1 = __importDefault(require("./heating/pipe.model"));
var overlap_model_1 = __importDefault(require("../overlap.model"));
var Canvas = /** @class */ (function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this.actionMode = null;
        this.mode = "pipe";
        this.actionObject = null;
        this.placingObject = null;
        this.nearestObject = null;
        this.hoveredObjects = [];
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
            overlap: {
                bindDistance: 0,
            },
        };
        this.overlap = new overlap_model_1.default(this);
        this.pipes.push(new pipe_model_1.default(new vect_1.Vector(40, 100), new vect_1.Vector(300, 100)));
        // this.pipes.push(new Pipe(new Vector(40, 200), new Vector(100, 260)));
        // this.pipes.push(new Pipe(new Vector(40, 380), new Vector(100, 320)));
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
        return this.pipes[this.pipes.length - 1];
    };
    Canvas.prototype.addValve = function (v) {
        this.valves.push(v);
        this.valves = this.valves;
        return this.valves[this.valves.length - 1];
    };
    Canvas.prototype.getPipeByID = function (id) {
        return this.pipes.find(function (p) { return p.id === id; });
    };
    return Canvas;
}());
exports.default = Canvas;
