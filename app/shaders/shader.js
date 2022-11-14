"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = exports.vertex = void 0;
var vertex = function () {
    //   return `
    //    attribute vec4 aVertexPosition;
    //
    //    uniform mat4 uModelViewMatrix;
    //    uniform mat4 uProjectionMatrix;
    //
    //    void main() {
    //       gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    //    }
    // `;
    return "\n    attribute vec2 a_position;\n\n    uniform vec2 u_resolution;\n    \n    void main() {\n       // convert the rectangle points from pixels to 0.0 to 1.0\n       vec2 zeroToOne = a_position / u_resolution;\n    \n       // convert from 0->1 to 0->2\n       vec2 zeroToTwo = zeroToOne * 2.0;\n    \n       // convert from 0->2 to -1->+1 (clipspace)\n       vec2 clipSpace = zeroToTwo - 1.0;\n    \n       gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n    }\n  ";
};
exports.vertex = vertex;
var fragment = function () {
    return "\n    void main() {\n      gl_FragColor = vec4(0, 0, 0, 1);\n    }\n  ";
};
exports.fragment = fragment;
