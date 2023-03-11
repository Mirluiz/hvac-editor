"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = exports.vertex = void 0;
var vertex = function () {
    return "\n    attribute vec2 a_position;\n    attribute vec3 a_color;\n    varying vec4 vColor;\n    \n    uniform mat3 u_matrix;\n    \n    void main() {\n        // gl_Position = vec4((u_matrix * vec3(a_position, 1)).xy, 0, 1);\n        gl_Position = vec4(a_position, 0, 1);\n        vColor =  vec4(a_color, 1.0);\n    }\n  ";
};
exports.vertex = vertex;
var fragment = function () {
    return "\n    precision mediump float;\n    varying vec4 vColor;\n    \n    void main() {\n      gl_FragColor = vColor;\n    }\n  ";
};
exports.fragment = fragment;
