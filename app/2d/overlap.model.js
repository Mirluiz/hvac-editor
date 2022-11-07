"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../geometry/vect");
var Overlap = /** @class */ (function () {
    function Overlap(model) {
        this.boundMouse = null;
        this.walls = [];
        this.pipes = [];
        this.valves = [];
        this.objectIOs = [];
        this.list = [];
        this.boundList = [];
        this.model = model;
    }
    Object.defineProperty(Overlap.prototype, "isEmpty", {
        get: function () {
            return this.list.length === 0 && this.boundList.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Overlap.prototype.update = function () {
        var netBoundMouse = new vect_1.Vector(Math.round(this.model.mouse.x / this.model.config.net.step) *
            this.model.config.net.step, Math.round(this.model.mouse.y / this.model.config.net.step) *
            this.model.config.net.step);
        var v = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        this.wallsOverlap();
        this.list = __spreadArray(__spreadArray([], this.pipeOverlap(v), true), this.IOOverlap(v), true);
        this.boundList = __spreadArray(__spreadArray([], this.pipeOverlap(netBoundMouse), true), this.IOOverlap(netBoundMouse), true);
        if (this.list.length === 0 && this.boundList.length === 0) {
            this.boundMouse = netBoundMouse.clone();
        }
        // else {
        //   let firstElement = [...this.list, ...this.boundList][0];
        //
        //   if (firstElement.pipe) {
        //     this.boundMouse = firstElement.pipe.vec;
        //   } else if (firstElement.io) {
        //     this.boundMouse = firstElement.io.getVecAbs();
        //   } else if (firstElement.fitting) {
        //     this.boundMouse = firstElement.fitting.center;
        //   } else if (firstElement.pipeEnd) {
        //     this.boundMouse = firstElement.pipeEnd.vec;
        //   } else {
        //     this.boundMouse = netBoundMouse.clone();
        //   }
        // }
    };
    Overlap.prototype.wallsOverlap = function () {
        this.model.walls.map(function () { });
    };
    //Todo: currently all project use this, split it.
    Overlap.prototype.pipeOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.pipes.map(function (pipe) {
            var _p = null;
            if (pipe.from.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    pipeEnd: pipe.from,
                };
            }
            if (!_p && pipe.to.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    pipeEnd: pipe.to,
                };
            }
            if (!_p) {
                var l = vec.distanceToLine(pipe);
                if (l <= bind) {
                    var normPipe = pipe.toOrigin().normalize();
                    var projPipe = pipe.toOrigin().projection(vec.sub(pipe.from.vec));
                    _p = {
                        id: pipe.id,
                        body: {
                            object: pipe,
                            vec: normPipe.multiply(projPipe).sum(pipe.from.vec),
                        },
                    };
                }
            }
            if (_p)
                ret.push(_p);
        });
        return ret;
    };
    Overlap.prototype.IOOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.radiators.map(function (radiator) {
            radiator.IOs.map(function (io) {
                var _r = null;
                if (io.getVecAbs().sub(vec).length <= bind) {
                    _r = {
                        id: radiator.id,
                        io: io,
                    };
                }
                if (_r)
                    ret.push(_r);
            });
        });
        if (ret.length > 1) {
            ret.sort(function (a, b) {
                return 1;
                // return a.io?.vec.x -
            });
        }
        return ret;
    };
    return Overlap;
}());
exports.default = Overlap;
