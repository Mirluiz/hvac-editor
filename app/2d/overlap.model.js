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
        this.first = null;
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
        var wMouse = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        var netBoundMouse = new vect_1.Vector(Math.round(wMouse.x / this.model.config.net.step) *
            this.model.config.net.step, Math.round(wMouse.y / this.model.config.net.step) *
            this.model.config.net.step);
        var v = new vect_1.Vector(wMouse.x, wMouse.y);
        this.wallsOverlap();
        this.list = __spreadArray(__spreadArray([], this.pipeOverlap(v), true), this.IOOverlap(v), true);
        this.boundList = __spreadArray(__spreadArray([], this.pipeOverlap(netBoundMouse), true), this.IOOverlap(netBoundMouse), true);
        if (this.list.length === 0 && this.boundList.length === 0) {
            this.boundMouse = netBoundMouse.clone();
        }
        this.firstOverlap();
    };
    Overlap.prototype.direct = function (vec) {
        var list = __spreadArray(__spreadArray([], this.pipeOverlap(vec), true), this.IOOverlap(vec), true);
        return list;
    };
    /**
     * it is sorted by height (more height -> more closer to user)
     */
    Overlap.prototype.firstOverlap = function () {
        var overlaps = __spreadArray(__spreadArray([], this.list, true), this.boundList, true);
        if (overlaps.length > 1) {
            overlaps.sort(function (a, b) {
                var aZ = 0;
                var bZ = 0;
                if (a.fitting) {
                    aZ = a.fitting.center.z;
                }
                else if (a.io) {
                    aZ = a.io.getVecAbs().z;
                }
                else if (a.body) {
                    aZ = a.body.vec.z;
                }
                if (b.fitting) {
                    bZ = b.fitting.center.z;
                }
                else if (b.io) {
                    bZ = b.io.getVecAbs().z;
                }
                else if (b.body) {
                    bZ = b.body.vec.z;
                }
                return aZ - bZ;
            });
        }
        this.first = overlaps[0];
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
                    end: pipe.from,
                };
            }
            if (!_p && pipe.to.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    end: pipe.to,
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
    Overlap.prototype.fittingOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.fittings.map(function (fitting) {
            var _f = null;
            if (fitting.center.sub(vec).length <= bind) {
                _f = {
                    id: fitting.id,
                    fitting: fitting,
                };
            }
            if (_f)
                ret.push(_f);
        });
        if (ret.length > 1) {
            ret.sort(function (a, b) {
                return 1;
                // return a.io?.vec.x -
            });
        }
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
