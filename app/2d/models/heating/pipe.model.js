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
    Pipe.prototype.update = function () {
        var _this = this;
        this.model.pipes.map(function (_pipe) {
            if (_pipe.id === _this.id)
                return;
            if (_pipe.isClose(_this.from.vec) || _pipe.isClose(_this.to.vec)) {
                _this.merge(_pipe);
            }
        });
        this.model.fittings.map(function (fitting) {
            if (fitting.isClose(_this.from.vec) && !_this.from.target) {
                _this.connect(fitting);
            }
            if (fitting.isClose(_this.to.vec) && !_this.to.target) {
                _this.connect(fitting);
            }
        });
    };
    Pipe.prototype.validation = function () {
        var _this = this;
        var can = true;
        [this.from, this.to].map(function (end) {
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            overlaps = overlaps.filter(function (o) { return o.id !== _this.id; });
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                var angleBetween = void 0;
                if (overlap && overlap.pipeEnd) {
                    angleBetween = overlap.pipeEnd
                        .getOpposite()
                        .vec.sub(end.vec)
                        .angle(end.getOpposite().vec.sub(end.vec));
                    if (angleBetween !== undefined &&
                        Math.abs(angleBetween * (180 / Math.PI)) < 90) {
                        can = false;
                    }
                }
                else if (overlap && overlap.pipe) {
                    can = true;
                }
                else {
                    can = false;
                }
            }
        });
        if (!can) {
            console.warn("Cant merge");
        }
        return can;
    };
    Pipe.prototype.beforeMerge = function () {
        console.log("before merge");
        return this.validation();
    };
    Pipe.prototype.afterMerge = function () {
        console.log("after merge");
    };
    Pipe.prototype.merge = function (pipe) {
        var _this = this;
        var merged = false;
        if (!this.beforeMerge())
            return false;
        var run = function (end) {
            if (_this.id === pipe.id)
                return;
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            overlaps = overlaps.filter(function (o) { return o.id !== end.getPipe().id; });
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                if (overlap && overlap.pipeEnd) {
                    if (overlap.pipeEnd.target)
                        return;
                    var newFitting = new fitting_model_1.default(_this.model, overlap.pipeEnd.vec);
                    _this.model.addFitting(newFitting);
                    newFitting.addPipe(overlap.pipeEnd.getPipe());
                    newFitting.addPipe(end.getPipe());
                    overlap.pipeEnd.target = newFitting;
                    end.target = newFitting;
                }
                else if (overlap && overlap.pipe) {
                    var mergePoint = overlap.pipe.vec.bindNet(_this.model.config.net.step);
                    var newP1 = new Pipe(_this.model, overlap.pipe.object.from.vec.clone(), new vect_1.Vector(mergePoint.x, mergePoint.y));
                    var newP2 = new Pipe(_this.model, new vect_1.Vector(mergePoint.x, mergePoint.y), overlap.pipe.object.to.vec.clone());
                    _this.model.addPipe(newP1);
                    _this.model.addPipe(newP2);
                    overlap.pipe.object.delete();
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
            }
        };
        if (!this.from.target)
            run(this.from);
        if (!this.to.target)
            run(this.to);
        this.afterMerge();
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
