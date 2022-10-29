"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Stats = /** @class */ (function () {
    function Stats(model) {
        this.model = model;
        this.container = document.querySelector("#stats");
        this.init();
    }
    Stats.prototype.init = function () {
        this.initContainer();
    };
    Stats.prototype.render = function () {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        if (!this.container)
            return;
        this.container.innerHTML = "\n      <div style=\"display: flex; flex-direction: column\">\n        <div>x - ".concat(Math.round(this.model.offset.x), " \n        / y - ").concat(Math.round(this.model.offset.y), "</div>\n        \n        <div>x - ").concat(Math.round((_b = (_a = this.model.mouse) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0), " \n        / y - ").concat(Math.round((_d = (_c = this.model.mouse) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0), "</div>\n        \n        <div>scale - ").concat(this.model.scale.amount, "</div>\n        <div>width - ").concat((_e = this.model.canvasSize) === null || _e === void 0 ? void 0 : _e.x, " / height - ").concat((_f = this.model.canvasSize) === null || _f === void 0 ? void 0 : _f.y, " / </div>\n        <div>ratio x ").concat((_g = this.model.mouseCanvasRatio) === null || _g === void 0 ? void 0 : _g.x, " / y ").concat((_h = this.model.mouseCanvasRatio) === null || _h === void 0 ? void 0 : _h.y, "</div>\n        <div>mode is ").concat(this.model.actionMode, "</div>\n      </div>\n      \n      </div>\n        <div>fitting size is ").concat(this.model.fittings.length, "</div>\n        <div>pipes size is ").concat(this.model.pipes.length, "</div>\n      </div>\n      </div>\n        <div>hovered object ").concat((_j = this.model.getPipeByID(this.model.overlap.list.length > 0 && this.model.overlap.list[0].id
            ? this.model.overlap.list[0].id
            : "")) === null || _j === void 0 ? void 0 : _j.id, "</div>\n        <div>pipes size is ").concat(this.model.pipes.length, "</div>\n      </div>\n    ");
    };
    Stats.prototype.initContainer = function () {
        if (!this.container)
            return;
        this.container.style.height = "450px";
        this.container.style.width = "300px";
        this.container.style.border = "1px solid black";
        this.container.style.marginLeft = "10px";
    };
    return Stats;
}());
exports.default = Stats;
