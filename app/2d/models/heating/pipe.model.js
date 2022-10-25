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
var line_model_1 = __importDefault(require("../geometry/line.model"));
var Pipe = /** @class */ (function (_super) {
    __extends(Pipe, _super);
    function Pipe(start, end) {
        var _this = _super.call(this, start, end) || this;
        _this.temp = false;
        _this.type = "supply";
        return _this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function () {
            return this.type === "supply" ? "red" : "blue";
        },
        enumerable: false,
        configurable: true
    });
    return Pipe;
}(line_model_1.default));
exports.default = Pipe;
