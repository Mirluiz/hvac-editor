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
var Overlap = /** @class */ (function () {
    function Overlap(model) {
        this.mouse = null;
        this.netBoundMouse = null;
        this.walls = [];
        this.pipes = [];
        this.valves = [];
        this.list = [];
        this.netBoundList = [];
        this.model = model;
    }
    Overlap.prototype.update = function (mouse) {
        this.mouse = mouse;
        this.wallsOverlap();
        this.list = __spreadArray([], this.pipeOverlap(this.mouse), true);
        this.updateList();
        // this.updateNetBoundList();
    };
    Overlap.prototype.wallsOverlap = function () {
        this.model.walls.map(function () { });
    };
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
                        pipe: {
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
    Overlap.prototype.updateList = function () {
        var _a;
        this.list = [];
        (_a = this.list).push.apply(_a, this.pipes);
    };
    return Overlap;
}());
exports.default = Overlap;
