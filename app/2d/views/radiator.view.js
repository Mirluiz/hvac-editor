"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var radiator_model_1 = __importDefault(require("../models/ghost/heating/radiator.model"));
var Radiator = /** @class */ (function () {
    function Radiator(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Radiator.prototype.drawRadiators = function () {
        var _this = this;
        this.canvas.model.radiators.map(function (radiator) {
            _this.drawRadiator(radiator);
        });
    };
    Radiator.prototype.drawRadiator = function (radiator) {
        this.ctx.save();
        this.ctx.beginPath();
        var toCenter = new vect_1.Vector(-radiator.width / 2, -radiator.height / 2).sum(radiator.center);
        var wP = this.canvas.model.getLocalCoordinates(radiator.center.x, radiator.center.y);
        this.ctx.strokeStyle = "red";
        this.ctx.rect(toCenter.x, toCenter.y, radiator.width, radiator.height);
        this.ctx.stroke();
        this.ctx.restore();
    };
    Radiator.prototype.drawGhost = function (radiator) {
        this.ctx.save();
        this.ctx.beginPath();
        var toCenter = new vect_1.Vector(-radiator.width / 2, -radiator.height / 2).sum(radiator.center);
        var wP = this.canvas.model.getLocalCoordinates(radiator.center.x, radiator.center.y);
        this.ctx.strokeStyle = "red";
        this.ctx.rect(toCenter.x, toCenter.y, radiator.width, radiator.height);
        this.ctx.stroke();
        this.ctx.restore();
    };
    Radiator.prototype.draw = function () {
        this.drawRadiators();
        if (this.canvas.model.placingObject &&
            this.canvas.model.placingObject instanceof radiator_model_1.default) {
            this.drawGhost(this.canvas.model.placingObject);
        }
    };
    return Radiator;
}());
exports.default = Radiator;
