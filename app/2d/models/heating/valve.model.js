"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../../geometry/vect");
var arc_model_1 = __importDefault(require("../geometry/arc.model"));
var pipe_model_1 = __importDefault(require("./pipe.model"));
var Valve = /** @class */ (function (_super) {
    __extends(Valve, _super);
    function Valve(model, center) {
        var _this = _super.call(this, center) || this;
        _this._pipes = [];
        _this.width = 10;
        _this.length = 20;
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Valve.prototype, "pipes", {
        get: function () {
            return this._pipes;
        },
        set: function (value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Valve.prototype.beforeMerge = function () {
        return true;
    };
    Valve.prototype.merge = function () {
        var _this = this;
        var merged = false;
        if (!this.beforeMerge())
            return false;
        var overlaps = this.model.overlap.pipeOverlap(this.center);
        overlaps = overlaps.filter(function (o) { return o.id !== _this.id; });
        overlaps.map(function (overlap) {
            if (overlap.pipe) {
                var mergePoint = overlap.pipe.vec.bindNet(_this.model.config.net.step);
                var newP1 = new pipe_model_1.default(_this.model, overlap.pipe.object.from.vec.clone(), new vect_1.Vector(mergePoint.x, mergePoint.y));
                var newP2 = new pipe_model_1.default(_this.model, new vect_1.Vector(mergePoint.x, mergePoint.y), overlap.pipe.object.to.vec.clone());
                _this.model.addPipe(newP1);
                _this.model.addPipe(newP2);
                overlap.pipe.object.delete();
                var newValve = new Valve(_this.model, mergePoint);
                _this.model.addValve(newValve);
                newValve.addPipe(newP1);
                newValve.addPipe(newP2);
                newP1.from.target = overlap.pipe.object.from.target;
                newP1.to.target = { id: newValve.id, object: newValve };
                newP2.from.target = { id: newValve.id, object: newValve };
                newP2.to.target = overlap.pipe.object.to.target;
                merged = true;
            }
        });
        this.afterMerge();
        return merged;
    };
    Valve.prototype.afterMerge = function () { };
    Valve.prototype.isClose = function (v) {
        var distance = this.model.config.overlap.bindDistance;
        return this.center.sub(v).length <= distance;
    };
    Valve.prototype.addPipe = function (pipe) {
        this._pipes.push(pipe);
        this.pipes = this._pipes;
        return this.pipes[this.pipes.length - 1];
    };
    return Valve;
}(arc_model_1.default));
exports.default = Valve;
