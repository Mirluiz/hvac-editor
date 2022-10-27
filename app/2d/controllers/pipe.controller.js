"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Pipe = /** @class */ (function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function () { };
    Pipe.prototype.mouseDown = function (coord) {
        // this.model.update(coord);
    };
    Pipe.prototype.mouseUp = function () {
        // let p = new PipeGhostModel(
        //   new Vector(coord.x, coord.y),
        //   new Vector(coord.x, coord.y)
        // );
        //
        // p.width = 5;
        //
        // this.model.addPipe(p);
    };
    return Pipe;
}());
exports.default = Pipe;
