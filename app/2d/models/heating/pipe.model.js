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
        var _this = _super.call(this, {
            target: null,
            vec: from,
            title: "from",
            getPipe: function () {
                return _this;
            },
            getOpposite: function () {
                return _this.to;
            },
        }, {
            target: null,
            vec: to,
            title: "to",
            getPipe: function () {
                return _this;
            },
            getOpposite: function () {
                return _this.from;
            },
        }) || this;
        _this.type = "supply";
        _this.width = 10;
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
    Pipe.prototype.update = function (pipe) {
        this.model.pipes.map(function (_pipe) {
            if (_pipe.id === pipe.id)
                return;
            if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
                pipe.merge(_pipe);
            }
        });
        this.model.fittings.map(function (fitting) {
            if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
                pipe.connect(fitting);
            }
            if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
                pipe.connect(fitting);
            }
        });
    };
    Pipe.prototype.beforeMerge = function (pipe1, pipe2) {
        var _this = this;
        var canMerge = false;
        var mergingVec = null;
        var angleBetween;
        [pipe1.from, pipe1.to, pipe2.from, pipe2.to].map(function (end) {
            if (mergingVec)
                return;
            var overlap = _this.model.overlap.pipeOverlap(end.vec);
            if (overlap.length > 0) {
                var _end = overlap.find(function (p) { return "pipeEnd" in p && end.getPipe().id !== p.id; });
                if (_end && _end.pipeEnd) {
                    angleBetween = _end.pipeEnd
                        .getOpposite()
                        .vec.sub(end.vec)
                        .angle(end.getOpposite().vec.sub(end.vec));
                }
            }
        });
        if (angleBetween !== undefined &&
            Math.abs(angleBetween * (180 / Math.PI)) >= 90) {
            canMerge = true;
        }
        else {
            alert("Cant merge");
        }
        return canMerge;
    };
    Pipe.prototype.afterMerge = function () { };
    Pipe.prototype.merge = function (pipe) {
        var _this = this;
        var distance = this.model.config.overlap.bindDistance;
        var merged = false;
        if (!this.beforeMerge(pipe, this))
            return false;
        var run = function (end) {
            if (_this.id === pipe.id)
                return;
            if (pipe.isClose(end.vec)) {
                var mergePoint = void 0;
                if (pipe.from.vec.sub(end.vec).length <= distance) {
                    if (pipe.from.target)
                        return;
                    mergePoint = pipe.from.vec.clone();
                    var newFitting_1 = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting_1);
                    newFitting_1.addPipe(pipe);
                    newFitting_1.addPipe(_this);
                    pipe.from.target = newFitting_1;
                    end.target = newFitting_1;
                    return;
                }
                else if (pipe.to.vec.sub(end.vec).length <= distance) {
                    if (pipe.to.target)
                        return;
                    mergePoint = pipe.to.vec.clone();
                    var newFitting_2 = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting_2);
                    newFitting_2.addPipe(pipe);
                    newFitting_2.addPipe(_this);
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
                _this.model.addPipe(newP1);
                _this.model.addPipe(newP2);
                pipe.delete();
                var newFitting = new fitting_model_1.default(_this.model, mergePoint);
                _this.model.addFitting(newFitting);
                newFitting.addPipe(newP1);
                newFitting.addPipe(newP2);
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
    Pipe.prototype.connect = function (target) {
        var merged = false;
        if (target instanceof fitting_model_1.default) {
            var isFrom = target.isClose(this.from.vec);
            var isTo = target.isClose(this.to.vec);
            if (isFrom || isTo) {
                target.addPipe(this);
                merged = true;
            }
            if (isFrom) {
                this.from.target = target;
            }
            else if (isTo)
                this.to.target = target;
            return merged;
        }
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
