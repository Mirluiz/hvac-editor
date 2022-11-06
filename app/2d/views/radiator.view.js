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
        var _this = this;
        this.ctx.save();
        this.ctx.beginPath();
        var toCenter = radiator.objectCenter.sum(radiator.center);
        var wP = this.canvas.model.getLocalCoordinates(radiator.center.x, radiator.center.y);
        this.ctx.rect(toCenter.x, toCenter.y, radiator.width, radiator.height);
        this.ctx.stroke();
        this.ctx.restore();
        radiator.IOs.map(function (io) {
            var toCenter = io.getVecAbs();
            var wP = _this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);
            _this.ctx.save();
            _this.ctx.beginPath();
            _this.ctx.strokeStyle = "red";
            _this.ctx.arc(wP.x, wP.y, 5, 0, 2 * Math.PI);
            _this.ctx.fillStyle = io.type === "supply" ? "red" : "blue";
            _this.ctx.fill();
            _this.ctx.restore();
        });
    };
    Radiator.prototype.drawGhost = function (radiator) {
        var _this = this;
        this.ctx.save();
        this.ctx.beginPath();
        var toCenter = new vect_1.Vector(-radiator.width / 2, -radiator.height / 2).sum(radiator.center);
        var wP = this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);
        this.ctx.strokeStyle = "red";
        this.ctx.rect(wP.x, wP.y, radiator.width, radiator.height);
        this.ctx.stroke();
        this.ctx.restore();
        radiator.IOs.map(function (io) {
            var toCenter = new vect_1.Vector(-radiator.width / 2, -radiator.height / 2).sum(radiator.center.sum(io.vec));
            var wP = _this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);
            // this.ctx.save();
            // this.ctx.beginPath();
            // this.ctx.strokeStyle = "red";
            // this.ctx.arc(wP.x, wP.y, 5, 0, 2 * Math.PI);
            // this.ctx.fillStyle = io.type === "supply" ? "red" : "blue";
            // this.ctx.fill();
            // this.ctx.restore();
        });
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
