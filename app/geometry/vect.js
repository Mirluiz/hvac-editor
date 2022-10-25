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
        return 1;
    };
    Object.defineProperty(Vector.prototype, "length", {
        get: function () {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.projection = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    Vector.prototype.angle = function (v) {
        return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
    };
    return Vector;
}());
exports.Vector = Vector;
