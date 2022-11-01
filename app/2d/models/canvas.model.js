"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var overlap_model_1 = __importDefault(require("../overlap.model"));
var common_1 = require("../../_test_/common");
var Canvas = /** @class */ (function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this._fittings = [];
        this.mode = "pipe";
        this.subMode = null;
        this.actionMode = null;
        this.actionObject = null;
        this.placingObject = null;
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
                bindDistance: 10,
            },
        };
        this.overlap = new overlap_model_1.default(this);
        (0, common_1.fittingModel)(this);
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
    Object.defineProperty(Canvas.prototype, "fittings", {
        get: function () {
            return this._fittings;
        },
        set: function (value) {
            this._fittings = value;
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
    Canvas.prototype.addFitting = function (fitting) {
        this.fittings.push(fitting);
        this.fittings = this.fittings;
        return this.fittings[this.fittings.length - 1];
    };
    Canvas.prototype.getPipeByID = function (id) {
        return this.pipes.find(function (p) { return p.id === id; });
    };
    Canvas.prototype.update = function () {
        var _this_1 = this;
        this.pipes.map(function (pipe) {
            _this_1.pipes.map(function (_pipe) {
                if (_pipe.id === pipe.id)
                    return;
                if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
                    pipe.merge(_pipe);
                }
            });
            _this_1.fittings.map(function (fitting) {
                if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
                    pipe.connect(fitting);
                }
                if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
                    pipe.connect(fitting);
                }
            });
        });
    };
    //TODO: apply scale transformation here
    Canvas.prototype.getWorldCoordinates = function (x, y) {
        return new vect_1.Vector((x + this.offset.x) * this.scale.amount, (y + this.offset.y) * this.scale.amount);
    };
    //x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord.x,
    //       y: (y + this.model.offset.y)  * this.model.scale.amount,
    Canvas.prototype.getLocalCoordinates = function (x, y) {
        var _this = this;
        var scale = function (vec) {
            return new vect_1.Vector(vec.x * _this.scale.amount, vec.y * _this.scale.amount);
        };
        var translate = function (vec) {
            return new vect_1.Vector(vec.x + _this.offset.x, vec.y + _this.offset.y);
        }.bind(this);
        var t = new vect_1.Vector(x, y);
        t = scale(t);
        // t = rotation(t); TODO order is scaling rotation translation
        t = translate(t);
        return t;
    };
    Canvas.prototype.deletePipe = function (id) {
        this.pipes = this.pipes.filter(function (p) { return p.id !== id; });
    };
    return Canvas;
}());
exports.default = Canvas;
