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
var arc_model_1 = __importDefault(require("../geometry/arc.model"));
var Fitting = /** @class */ (function (_super) {
    __extends(Fitting, _super);
    function Fitting(model, center) {
        var _this = _super.call(this, center) || this;
        _this._pipes = [];
        _this.width = 20;
        _this.height = 20;
        _this.color = [0, 0, 0];
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Fitting.prototype, "pipes", {
        get: function () {
            return this._pipes;
        },
        set: function (value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fitting.prototype, "type", {
        get: function () {
            var ret = null;
            if (this.pipes.length === 2)
                ret = "2d";
            if (this.pipes.length === 3)
                ret = "3d";
            if (this.pipes.length === 4)
                ret = "4d";
            return ret;
        },
        enumerable: false,
        configurable: true
    });
    Fitting.prototype.isClose = function (v) {
        var distance = this.model.config.overlap.bindDistance;
        return this.center.sub(v).length <= distance;
    };
    Fitting.prototype.addPipe = function (pipe) {
        this._pipes.push(pipe);
        this.pipes = this._pipes;
        return this.pipes[this.pipes.length - 1];
    };
    return Fitting;
}(arc_model_1.default));
exports.default = Fitting;
