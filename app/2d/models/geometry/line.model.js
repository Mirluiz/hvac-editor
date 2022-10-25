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
var main_model_1 = __importDefault(require("../main.model"));
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(start, end) {
        var _this = _super.call(this) || this;
        _this.thickness = 1;
        _this._color = "#000";
        _this.width = 1;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    Object.defineProperty(Line.prototype, "color", {
        // getNearest(pipes: Array<Pipe>) {
        //   let pipe = pipes.find((pipe) => {
        //     if (pipe._id === this._id) return;
        //
        //     let start = pipe.start.distanceTo(this.end);
        //     let end = pipe.end.distanceTo(this.end);
        //
        //     return (start && start < 30) || (end && end < 30);
        //   });
        //
        //   return pipe;
        // }
        //
        // getNearestCoordinateOnPipe(coord: IVec, pipe: Pipe) {
        //   let _coord = coord.sub(pipe.start);
        // }
        get: function () {
            return this._color;
        },
        enumerable: false,
        configurable: true
    });
    return Line;
}(main_model_1.default));
exports.default = Line;
