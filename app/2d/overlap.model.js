"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../geometry/vect");
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
        this.pipeOverlap();
        this.updateList();
        // this.updateNetBoundList();
    };
    Overlap.prototype.wallsOverlap = function () {
        this.model.walls.map(function () { });
    };
    Overlap.prototype.pipeOverlap = function () {
        var _this = this;
        this.pipes = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.pipes.map(function (pipe) {
            if (!_this.mouse)
                return;
            var _p = null;
            if (pipe.from.vec.sub(_this.mouse).length <= bind) {
                _p = {
                    type: "pipe",
                    id: pipe.id,
                    ioVector: new vect_1.Vector(pipe.from.vec.x, pipe.from.vec.y),
                };
            }
            if (!_p && pipe.to.vec.sub(_this.mouse).length <= bind) {
                _p = {
                    type: "pipe",
                    id: pipe.id,
                    ioVector: new vect_1.Vector(pipe.to.vec.x, pipe.to.vec.y),
                };
            }
            if (!_p) {
                var l = _this.mouse.distanceToLine(pipe);
                if (l <= bind) {
                    var normPipe = pipe.toOrigin().normalize();
                    var projPipe = pipe
                        .toOrigin()
                        .projection(_this.mouse.sub(pipe.from.vec));
                    _p = {
                        type: "pipe",
                        id: pipe.id,
                        ioVector: normPipe.multiply(projPipe).sum(pipe.from.vec),
                    };
                }
            }
            if (_p)
                _this.pipes.push(_p);
        });
    };
    Overlap.prototype.updateList = function () {
        var _a;
        this.list = [];
        (_a = this.list).push.apply(_a, this.pipes);
    };
    return Overlap;
}());
exports.default = Overlap;
