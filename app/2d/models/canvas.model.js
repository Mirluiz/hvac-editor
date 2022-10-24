"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var wall_model_1 = __importDefault(require("./architecture/wall.model"));
var pipe_model_1 = __importDefault(require("./heating/pipe.model"));
var Canvas = /** @class */ (function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this.actionMode = "pipe";
        this.actionObject = null;
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
        this.offset = new vect_1.Vector(0, 0);
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
    Canvas.prototype.addValve = function (center) { };
    return Canvas;
}());
exports.default = Canvas;
