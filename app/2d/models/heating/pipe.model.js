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
var line_model_1 = __importDefault(require("../geometry/line.model"));
var fitting_model_1 = __importDefault(require("./fitting.model"));
var Pipe = /** @class */ (function (_super) {
    __extends(Pipe, _super);
    function Pipe(model, from, to) {
        var _this = _super.call(this, { target: null, vec: from }, { target: null, vec: to }) || this;
        _this.type = "supply";
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function () {
            return this.type === "supply" ? "red" : "blue";
        },
        enumerable: false,
        configurable: true
    });
    Pipe.prototype.toOrigin = function () {
        return this.to.vec.sub(this.from.vec);
    };
    Pipe.prototype.merge = function () {
        var _this = this;
        var merged = false;
        this.model.fittings.map(function (fitting) {
            if (fitting.needMerge(_this.from.vec) || fitting.needMerge(_this.to.vec)) {
                merged = _this.mergeFitting(fitting);
            }
        });
        this.model.pipes.map(function (pipe) {
            if (_this.id === pipe.id)
                return;
            if (pipe.isClose(_this.from.vec) || pipe.isClose(_this.to.vec)) {
                merged = _this.mergePipe(pipe);
            }
        });
    };
    Pipe.prototype.mergePipe = function (pipe) {
        var _this = this;
        var distance = this.model.config.overlap.bindDistance;
        var merged = false;
        var run = function (end) {
            if (_this.id === pipe.id)
                return;
            if (pipe.isClose(end.vec)) {
                var mergePoint = void 0;
                if (pipe.from.vec.sub(end.vec).length <= distance &&
                    !pipe.from.target) {
                    mergePoint = pipe.from.vec.clone();
                    var newFitting_1 = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting_1);
                    pipe.from.target = newFitting_1;
                    end.target = newFitting_1;
                    return;
                }
                else if (pipe.to.vec.sub(end.vec).length <= distance &&
                    !pipe.to.target) {
                    mergePoint = pipe.to.vec.clone();
                    var newFitting_2 = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting_2);
                    pipe.to.target = newFitting_2;
                    end.target = newFitting_2;
                    return;
                }
                var normPipe = pipe.toOrigin().normalize();
                var projPipe = pipe.toOrigin().projection(end.vec.sub(pipe.from.vec));
                mergePoint = normPipe.multiply(projPipe).sum(pipe.from.vec);
                mergePoint = mergePoint.bindNet(_this.model.config.net.step);
                var newP1 = new Pipe(_this.model, new vect_1.Vector(0, 0).sum(pipe.from.vec), new vect_1.Vector(mergePoint.x, mergePoint.y));
                var newP2 = new Pipe(_this.model, new vect_1.Vector(mergePoint.x, mergePoint.y), new vect_1.Vector(pipe.to.vec.x, pipe.to.vec.y));
                // end = mergePoint.clone();
                _this.model.addPipe(newP1);
                _this.model.addPipe(newP2);
                pipe.delete();
                var newFitting = new fitting_model_1.default(_this.model, mergePoint);
                _this.model.addFitting(newFitting);
                newP1.from.target = pipe.from.target;
                newP1.to.target = newFitting;
                newP2.from.target = newFitting;
                newP2.to.target = pipe.to.target;
                merged = true;
            }
        };
        run(this.from);
        run(this.to);
        return merged;
    };
    Pipe.prototype.mergeFitting = function (fitting) {
        var merged = false;
        var isFrom = fitting.needMerge(this.from.vec);
        var isTo = fitting.needMerge(this.to.vec);
        if (isFrom || isTo) {
            fitting.pipes.push(this);
            merged = true;
        }
        if (isFrom) {
            this.from.target = fitting;
        }
        else if (isTo)
            this.to.target = fitting;
        return merged;
    };
    Pipe.prototype.isClose = function (end) {
        var distance = this.model.config.overlap.bindDistance;
        return (this.from.vec.sub(end).length <= distance ||
            this.to.vec.sub(end).length <= distance ||
            end.distanceToLine(this) <= distance);
    };
    Pipe.prototype.delete = function () {
        var _this = this;
        this.model.pipes = this.model.pipes.filter(function (_p) { return _p.id !== _this.id; });
    };
    return Pipe;
}(line_model_1.default));
exports.default = Pipe;
