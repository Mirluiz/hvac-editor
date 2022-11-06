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
var main_model_1 = __importDefault(require("../main.model"));
var Radiator = /** @class */ (function (_super) {
    __extends(Radiator, _super);
    function Radiator(model, center) {
        var _this = _super.call(this) || this;
        _this.width = 80;
        _this.height = 40;
        _this.IOs = [
            {
                type: "return",
                getRadiator: function () {
                    return _this;
                },
                vec: new vect_1.Vector(10, 10),
            },
            {
                type: "supply",
                getRadiator: function () {
                    return _this;
                },
                vec: new vect_1.Vector(10, 20),
            },
        ];
        _this.center = center;
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Radiator.prototype, "pipes", {
        get: function () {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Radiator.prototype.beforeMerge = function () {
        return true;
    };
    Radiator.prototype.merge = function () {
        var merged = false;
        if (!this.beforeMerge())
            return false;
        this.afterMerge();
        return merged;
    };
    Radiator.prototype.afterMerge = function () { };
    Radiator.prototype.isClose = function (v) {
        var distance = this.model.config.overlap.bindDistance;
        return this.center.sub(v).length <= distance;
    };
    return Radiator;
}(main_model_1.default));
exports.default = Radiator;
