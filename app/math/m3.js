"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.m3 = void 0;
exports.m3 = {
    identity: function () {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },
    projection: function (width, height) {
        return [1, 0, 0, 0, 1, 0, 0, 0, 1];
    },
    multiply: function (a, b) {
        return a.map(function (number, index) {
            return number * b[index] + number * b[index + 3] + number * b[index + 6];
        });
    },
};
