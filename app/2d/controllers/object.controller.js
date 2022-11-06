"use strict";
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
        var bV = new vect_1.Vector(this.model.netBoundMouse.x, this.model.netBoundMouse.y);
        var v = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        v = v.bindNet(this.model.config.net.step);
        bV = bV.bindNet(this.model.config.net.step);
        if (this.model.placingObject &&
            this.model.placingObject instanceof valve_model_1.default) {
            var overlaps = this.model.overlap.pipeOverlap(v);
            var pipeFound = null;
            this.model.placingObject.pipes = [];
            for (var _i = 0, overlaps_1 = overlaps; _i < overlaps_1.length; _i++) {
                var overlap = overlaps_1[_i];
                if (overlap.pipe) {
                    pipeFound = new vect_1.Vector(overlap.pipe.vec.x, overlap.pipe.vec.y);
                    break;
                }
            }
            if (pipeFound) {
                document.body.style.cursor = "default";
                this.model.placingObject.center.x = pipeFound.x;
                this.model.placingObject.center.y = pipeFound.y;
            }
            else {
                this.model.placingObject.center.x = bV.x;
                this.model.placingObject.center.y = bV.y;
                document.body.style.cursor = "not-allowed";
            }
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
    Pipe.prototype.mouseUp = function (coord) { };
    return Pipe;
}());
exports.default = Pipe;
