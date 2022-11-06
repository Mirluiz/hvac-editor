"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_model_1 = __importDefault(require("../models/ghost/heating/pipe.model"));
var pipe_model_2 = __importDefault(require("../models/heating/pipe.model"));
var Pipe = /** @class */ (function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function () {
        var coord = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        coord = coord.bindNet(this.model.config.net.step);
        if (this.model.actionObject &&
            this.model.actionObject instanceof pipe_model_1.default) {
            this.model.actionObject.to.vec.x = coord.x;
            this.model.actionObject.to.vec.y = coord.y;
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
    Pipe.prototype.mouseUp = function (coord) { };
    return Pipe;
}());
exports.default = Pipe;
