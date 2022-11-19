"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = exports.vertex = void 0;
var vertex = function () {
    return "\n    attribute vec2 a_position;\n    attribute vec3 a_color;\n\n    uniform vec2 u_resolution;\n    uniform mat3 u_matrix;\n    \n    varying vec4 vColor;\n    \n    void main() {\n        // Multiply the position by the matrix.\n        vec2 position = (u_matrix * vec3(a_position, 1)).xy;\n      \n        // convert the position from pixels to 0.0 to 1.0\n        vec2 zeroToOne = position / u_resolution;\n      \n        // convert from 0->1 to 0->2\n        vec2 zeroToTwo = zeroToOne * 2.0;\n      \n        // convert from 0->2 to -1->+1 (clipspace)\n        vec2 clipSpace = zeroToTwo - 1.0;\n      \n        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n        vColor =  vec4(a_color, 1.0);\n    }\n  ";
};
exports.vertex = vertex;
var fragment = function () {
    return "\n    precision mediump float;\n    varying vec4 vColor;\n    \n    void main() {\n      gl_FragColor = vColor;\n    }\n  ";
};
exports.fragment = fragment;
