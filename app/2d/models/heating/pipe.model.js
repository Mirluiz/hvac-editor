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
        return _super.call(this, start, end) || this;
    }
    Pipe.prototype.getNearestPipe = function (pipes) {
        var _this = this;
        var pipe = pipes.find(function (pipe) {
            if (pipe._id === _this._id)
                return;
            var start = pipe.start.distanceTo && pipe.start.distanceTo(_this.end);
            var end = pipe.end.distanceTo && pipe.end.distanceTo(_this.end);
            return (start && start < 30) || (end && end < 30);
        });
        return pipe;
    };
    Pipe.prototype.getNearestCoordinateOnPipe = function (point, pipe) {
        var _pipe = new Pipe(pipe.start.sub(pipe.start), pipe.end.sub(pipe.start));
    };
    return Pipe;
}(line_model_1.default));
exports.default = Pipe;
