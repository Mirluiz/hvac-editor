"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.distanceTo = function (v) {
        var _v = new Vector(this.x - v.x, this.y - v.y);
        return _v.length;
    };
    Vector.prototype.distanceToLine = function (l) {
        var ret;
        var lVec = l.to.vec.sub(l.from.vec);
        var vec = this.sub(l.from.vec);
        var angle = vec.angle(lVec);
        if (vec.length === 0)
            console.warn("ops");
        var p = lVec.product(vec);
        var p1 = vec.product(vec);
        var param = -1;
        if (p !== 0)
            param = p1 / p;
        if (param < 0) {
            ret = Math.round(vec.length);
        }
        else if (param > 1) {
            ret = Math.round(lVec.sub(vec).length);
        }
        else {
            ret = Math.round(Math.sin(angle) * vec.length);
        }
        return ret;
    };
    Object.defineProperty(Vector.prototype, "length", {
        get: function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.projection = function (b) {
        return this.product(b) / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    Vector.prototype.sum = function (v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    Vector.prototype.angle = function (v) {
        return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
    };
    Vector.prototype.product = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.normalize = function () {
        return new Vector(this.x / this.length, this.y / this.length);
    };
    Vector.prototype.multiply = function (a) {
        return new Vector(this.x * a, this.y * a);
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.bindNet = function (step) {
        return new Vector(Math.round(this.x / step) * step, Math.round(this.y / step) * step);
    };
    return Vector;
}());
exports.Vector = Vector;
