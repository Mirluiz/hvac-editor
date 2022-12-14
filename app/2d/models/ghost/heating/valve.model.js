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
var arc_model_1 = __importDefault(require("../../geometry/arc.model"));
var Valve = /** @class */ (function (_super) {
    __extends(Valve, _super);
    function Valve(model, center) {
        var _this = _super.call(this, center) || this;
        _this._pipes = [];
        _this.width = 10;
        _this.length = 20;
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Valve.prototype, "pipes", {
        get: function () {
            return this._pipes;
        },
        set: function (value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Valve.prototype.validation = function () {
        var overlaps = this.model.overlap.pipeOverlap(this.center);
        return overlaps.length > 0 && Boolean(overlaps.find(function (o) { return o.body; }));
    };
    return Valve;
}(arc_model_1.default));
exports.default = Valve;
