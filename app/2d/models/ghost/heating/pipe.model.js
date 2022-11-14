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
var line_model_1 = __importDefault(require("../../geometry/line.model"));
var fitting_model_1 = __importDefault(require("../../heating/fitting.model"));
var Pipe = /** @class */ (function (_super) {
    __extends(Pipe, _super);
    function Pipe(model, from, to) {
        var _this = _super.call(this, {
            vec: from,
            getPipe: function () {
                return _this;
            },
            getOpposite: function () {
                return _this.to;
            },
        }, {
            vec: to,
            getPipe: function () {
                return _this;
            },
            getOpposite: function () {
                return _this.from;
            },
        }) || this;
        _this.model = model;
        _this.z = 10;
        return _this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function () {
            return "black";
        },
        enumerable: false,
        configurable: true
    });
    Pipe.prototype.validation = function () {
        var _this = this;
        var can = true;
        [this.from, this.to].map(function (end) {
            if (!can)
                return;
            var overlaps = _this.model.overlap.direct(end.vec);
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                var angleBetween = void 0;
                if (overlap && overlap.end) {
                    angleBetween = overlap.end
                        .getOpposite()
                        .vec.sub(end.vec)
                        .angle(end.getOpposite().vec.sub(end.vec));
                    if (angleBetween !== undefined &&
                        Math.abs(angleBetween * (180 / Math.PI)) < 90) {
                        can = false;
                    }
                }
                else if (overlap && overlap.body) {
                    can = true;
                }
                else {
                    can = false;
                }
            }
        });
        if (!can) {
            return can;
        }
        [this.from, this.to].map(function (end) {
            var overlaps = _this.model.overlap.direct(end.vec);
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                if (overlap && overlap.end) {
                    if (overlap.end.target &&
                        !(overlap.end.target.object instanceof fitting_model_1.default)) {
                        can = false;
                        console.warn("Target is not empty");
                    }
                }
                if (overlap && overlap.io) {
                    if (overlap.io.isConnected()) {
                        can = false;
                        console.warn("Already is connected");
                    }
                }
            }
        });
        if (!can) {
            console.warn("Cant merge");
        }
        return can;
    };
    return Pipe;
}(line_model_1.default));
exports.default = Pipe;
