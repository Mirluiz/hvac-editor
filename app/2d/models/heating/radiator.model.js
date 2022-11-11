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
                getVecAbs: function () {
                    var v = new vect_1.Vector(-10, 0);
                    return v.sum(_this.objectCenter).sum(_this.center);
                },
                getRadiator: function () {
                    return _this;
                },
                vec: new vect_1.Vector(-10, 0),
                isConnected: function () {
                    var ret = _this.model.pipes.find(function (p) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return ((((_b = (_a = p.from.target) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.id) === _this.id &&
                            ((_d = (_c = p.from.target) === null || _c === void 0 ? void 0 : _c.io) === null || _d === void 0 ? void 0 : _d.type) === "return") ||
                            (((_f = (_e = p.to.target) === null || _e === void 0 ? void 0 : _e.object) === null || _f === void 0 ? void 0 : _f.id) === _this.id &&
                                ((_h = (_g = p.to.target) === null || _g === void 0 ? void 0 : _g.io) === null || _h === void 0 ? void 0 : _h.type) === "return"));
                    });
                    return Boolean(ret);
                },
            },
            {
                type: "supply",
                getVecAbs: function () {
                    var v = new vect_1.Vector(-10, 40);
                    return v.sum(_this.objectCenter).sum(_this.center);
                },
                getRadiator: function () {
                    return _this;
                },
                vec: new vect_1.Vector(-10, 40),
                isConnected: function () {
                    var ret = _this.model.pipes.find(function (p) {
                        var _a, _b, _c, _d, _e, _f, _g, _h;
                        return ((((_b = (_a = p.from.target) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.id) === _this.id &&
                            ((_d = (_c = p.from.target) === null || _c === void 0 ? void 0 : _c.io) === null || _d === void 0 ? void 0 : _d.type) === "supply") ||
                            (((_f = (_e = p.to.target) === null || _e === void 0 ? void 0 : _e.object) === null || _f === void 0 ? void 0 : _f.id) === _this.id &&
                                ((_h = (_g = p.to.target) === null || _g === void 0 ? void 0 : _g.io) === null || _h === void 0 ? void 0 : _h.type) === "supply"));
                    });
                    return Boolean(ret);
                },
            },
        ];
        _this.center = center;
        _this.model = model;
        _this.objectCenter = new vect_1.Vector(_this.width / 2, _this.height / 2).reverse();
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
        var ret = undefined;
        for (var _i = 0, _a = this.IOs; _i < _a.length; _i++) {
            var io = _a[_i];
            if (io.getVecAbs().sub(v).length <= distance) {
                ret = io;
            }
        }
        return ret;
    };
    return Radiator;
}(main_model_1.default));
exports.default = Radiator;
