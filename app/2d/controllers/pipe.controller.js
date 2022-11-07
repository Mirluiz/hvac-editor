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
var pipe_model_1 = __importDefault(require("../models/ghost/heating/pipe.model"));
var pipe_model_2 = __importDefault(require("../models/heating/pipe.model"));
var fitting_model_1 = __importDefault(require("../models/heating/fitting.model"));
var Pipe = /** @class */ (function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function () {
        var _a, _b;
        if (!this.model.overlap.boundMouse)
            return;
        var bV = new vect_1.Vector(this.model.overlap.boundMouse.x, this.model.overlap.boundMouse.y);
        if (this.model.actionObject &&
            this.model.actionObject instanceof pipe_model_1.default) {
            var target = null;
            for (var _i = 0, _c = __spreadArray(__spreadArray([], this.model.overlap.list, true), this.model.overlap.boundList, true); _i < _c.length; _i++) {
                var overlap = _c[_i];
                if (overlap.io) {
                    target = {
                        id: overlap.id,
                        io: overlap.io,
                        object: overlap.io.getRadiator(),
                    };
                }
                else if (overlap.fitting) {
                    target = {
                        id: overlap.id,
                        object: overlap.fitting,
                    };
                }
                else if (overlap.end) {
                    target = {
                        id: overlap.id,
                        end: overlap.end,
                    };
                }
                else if ((_a = overlap.body) === null || _a === void 0 ? void 0 : _a.object) {
                    target = {
                        id: overlap.id,
                        body: overlap.body,
                    };
                }
            }
            if (target === null || target === void 0 ? void 0 : target.io) {
                this.model.actionObject.to.target = target;
                this.model.actionObject.to.vec.x = target.io.getVecAbs().x;
                this.model.actionObject.to.vec.y = target.io.getVecAbs().y;
            }
            else if ((target === null || target === void 0 ? void 0 : target.object) instanceof fitting_model_1.default) {
                this.model.actionObject.to.target = target;
                this.model.actionObject.to.vec.x = target.object.center.x;
                this.model.actionObject.to.vec.y = target.object.center.y;
            }
            else if (((_b = target === null || target === void 0 ? void 0 : target.body) === null || _b === void 0 ? void 0 : _b.object) instanceof pipe_model_2.default) {
                this.model.actionObject.to.target = target;
                this.model.actionObject.to.vec.x = target.body.vec.x;
                this.model.actionObject.to.vec.y = target.body.vec.y;
            }
            else {
                this.model.actionObject.to.target = null;
                this.model.actionObject.to.vec.x = bV.x;
                this.model.actionObject.to.vec.y = bV.y;
            }
            if (!this.model.actionObject.validation()) {
                document.body.style.cursor = "not-allowed";
            }
            else {
                document.body.style.cursor = "default";
            }
        }
    };
    Pipe.prototype.mouseDown = function () {
        var _a;
        var coord = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        coord = coord.bindNet(this.model.config.net.step);
        if (!this.model.actionObject) {
            this.model.actionMode = "pipeLaying";
        }
        if (this.model.actionObject instanceof pipe_model_1.default) {
            var pipe = new pipe_model_2.default(this.model, this.model.actionObject.from.vec.clone(), this.model.actionObject.to.vec.clone());
            if (!this.model.actionObject.validation())
                return;
            pipe.type = (_a = this.model.subMode) !== null && _a !== void 0 ? _a : "supply";
            if (!pipe.validation())
                throw new Error("Cant merge");
            pipe.update();
            this.model.addPipe(pipe);
        }
        this.model.actionObject = new pipe_model_1.default(this.model, coord.clone(), coord.clone());
    };
    Pipe.prototype.mouseUp = function () { };
    return Pipe;
}());
exports.default = Pipe;
