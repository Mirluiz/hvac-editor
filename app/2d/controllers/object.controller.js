"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var valve_model_1 = __importDefault(require("../models/ghost/heating/valve.model"));
var valve_model_2 = __importDefault(require("../models/heating/valve.model"));
var radiator_model_1 = __importDefault(require("../models/ghost/heating/radiator.model"));
var radiator_model_2 = __importDefault(require("../models/heating/radiator.model"));
var Pipe = /** @class */ (function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function () {
        if (!this.model.overlap.boundMouse)
            return;
        var bV = new vect_1.Vector(this.model.overlap.boundMouse.x, this.model.overlap.boundMouse.y);
        if (this.model.placingObject &&
            this.model.placingObject instanceof valve_model_1.default) {
            if (!this.model.overlap.isEmpty) {
                document.body.style.cursor = "default";
                var pipeFound = __spreadArray(__spreadArray([], this.model.overlap.list, true), this.model.overlap.boundList, true).find(function (o) { return o.body; });
                if (pipeFound === null || pipeFound === void 0 ? void 0 : pipeFound.body) {
                }
                else {
                    document.body.style.cursor = "not-allowed";
                }
            }
            else {
                document.body.style.cursor = "not-allowed";
            }
            this.model.placingObject.center.x = bV.x;
            this.model.placingObject.center.y = bV.y;
        }
        if (this.model.placingObject &&
            this.model.placingObject instanceof radiator_model_1.default) {
            this.model.placingObject.center.x = bV.x;
            this.model.placingObject.center.y = bV.y;
        }
    };
    Pipe.prototype.mouseDown = function () {
        if (this.model.placingObject instanceof valve_model_1.default) {
            if (!this.model.placingObject.validation()) {
                console.log("Validation error");
                return;
            }
            var valve = new valve_model_2.default(this.model, this.model.placingObject.center.clone());
            valve.merge();
        }
        if (this.model.placingObject instanceof radiator_model_1.default) {
            if (!this.model.placingObject.validation()) {
                console.log("Validation error");
                return;
            }
            var radiator = new radiator_model_2.default(this.model, this.model.placingObject.center.clone());
            radiator.merge();
            this.model.addRadiator(radiator);
        }
    };
    Pipe.prototype.mouseUp = function () { };
    return Pipe;
}());
exports.default = Pipe;
