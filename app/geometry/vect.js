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
        if (v === void 0) { v = undefined; }
        if (v) {
            // return Math.atan2(
            //   this.x * v.y - this.y * v.x,
            //   this.x * v.x + this.y * v.y
            // );
            return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
        }
        return Math.atan2(this.y, this.x);
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
    Vector.prototype.perpendicular = function () {
        return new Vector(this.y, -this.x);
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.bindNet = function (step) {
        return new Vector(Math.round(this.x / step) * step, Math.round(this.y / step) * step);
    };
    Vector.prototype.drawVector = function () {
        var _this = this;
        //debug only
        setTimeout(function () {
            var container = document.querySelector("#editor");
            if (container) {
                var ctx = container.getContext("2d");
                if (!ctx)
                    return;
                ctx.save();
                ctx.arc(_this.x, _this.y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.restore();
            }
        }, 0);
    };
    return Vector;
}());
exports.Vector = Vector;
