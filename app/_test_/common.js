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
exports.fittingModel = void 0;
var pipe_model_1 = __importDefault(require("../2d/models/heating/pipe.model"));
var vect_1 = require("../geometry/vect");
var fittingModel = function (model) {
    var pipes = model.pipes;
    var step = model.config.net.step / 2;
    _2Pipes(model, pipes, step);
    // _3Pipes(model, pipes, step);
};
exports.fittingModel = fittingModel;
var _2Pipes = function (model, pipes, step) {
    /**
     * 90 angle from right to left
     * ------ *
     *        |
     *        |
     *        |
     *
     * Y+ is bottom
     */
    var arraysRL90 = [
        /*
          1 - from left to right
          2 - from top to bottom
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 10,
                y2: 4,
            },
            {
                x1: 10,
                y1: 4,
                x2: 10,
                y2: 10,
            },
        ],
        /*
          1 - from right to left
          2 - from top to bottom
         */
        [
            {
                x1: 10,
                y1: 4,
                x2: 4,
                y2: 4,
            },
            {
                x1: 10,
                y1: 4,
                x2: 10,
                y2: 10,
            },
        ],
        /*
          1 - from left to right
          2 - from bottom to top
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 10,
                y2: 4,
            },
            {
                x1: 10,
                y1: 10,
                x2: 10,
                y2: 4,
            },
        ],
        /*
          1 - from right to left
          2 - from bottom to top
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 10,
                y2: 4,
            },
            {
                x1: 10,
                y1: 10,
                x2: 10,
                y2: 4,
            },
        ],
    ];
    /**
     *  90 angle from left to right
     *    * -------
     *    |
     *    |
     *    |
     */
    var arraysLR90 = [
        /*
          2 - from left to right
          1 - from top to bottom
         */
        [
            {
                x1: 10,
                y1: 4,
                x2: 4,
                y2: 4,
            },
            {
                x1: 4,
                y1: 4,
                x2: 4,
                y2: 10,
            },
        ],
        /*
          1 - from left top to right
          2 - from top to bottom
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 10,
                y2: 4,
            },
            {
                x1: 4,
                y1: 4,
                x2: 4,
                y2: 10,
            },
        ],
        /*
          1 - from right to left
          2 - from bottom to top
         */
        [
            {
                x1: 10,
                y1: 4,
                x2: 4,
                y2: 4,
            },
            {
                x1: 4,
                y1: 10,
                x2: 4,
                y2: 4,
            },
        ],
        /*
          1 - from left to right
          2 - from bottom to top
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 10,
                y2: 4,
            },
            {
                x1: 4,
                y1: 10,
                x2: 4,
                y2: 4,
            },
        ],
    ];
    /**
     *  Down V from 90 angle
     *           *
     *          / \
     *        /    \
     *      /       \
     *    /          \
     */
    var arraysV90Down = [
        /*
          1 - from left to right,
          2 - from left to right
         */
        [
            {
                x1: 4,
                y1: 6,
                x2: 8,
                y2: 2,
            },
            {
                x1: 8,
                y1: 2,
                x2: 12,
                y2: 6,
            },
        ],
        /*
          1 - from right to left,
          2 - from left to right,
         */
        [
            {
                x1: 8,
                y1: 2,
                x2: 4,
                y2: 6,
            },
            {
                x1: 8,
                y1: 2,
                x2: 12,
                y2: 6,
            },
        ],
        /*
         1 - from left to right,
         2 - from right to left,
        */
        [
            {
                x1: 4,
                y1: 6,
                x2: 8,
                y2: 2,
            },
            {
                x1: 12,
                y1: 6,
                x2: 8,
                y2: 2,
            },
        ],
        /*
         1 - from right to left,
         2 - from right to left,
        */
        [
            {
                x1: 8,
                y1: 2,
                x2: 4,
                y2: 6,
            },
            {
                x1: 12,
                y1: 6,
                x2: 8,
                y2: 2,
            },
        ],
    ];
    /**
     *  V form 90 angle
     *   \       /
     *    \     /
     *     \   /
     *      \ /
     *       *
     */
    var arraysV90Up = [
        /*
          1 - from left to right,
          2 - from left to right
         */
        [
            {
                x1: 4,
                y1: 2,
                x2: 8,
                y2: 6,
            },
            {
                x1: 8,
                y1: 6,
                x2: 12,
                y2: 2,
            },
        ],
        /*
          1 - from right to left,
          2 - from left to right,
         */
        [
            {
                x1: 8,
                y1: 6,
                x2: 4,
                y2: 2,
            },
            {
                x1: 8,
                y1: 6,
                x2: 12,
                y2: 2,
            },
        ],
        /*
         1 - from left to right,
         2 - from right to left,
        */
        [
            {
                x1: 4,
                y1: 2,
                x2: 8,
                y2: 6,
            },
            {
                x1: 12,
                y1: 2,
                x2: 8,
                y2: 6,
            },
        ],
        /*
         1 - from right to left,
         2 - from right to left,
        */
        [
            {
                x1: 8,
                y1: 6,
                x2: 4,
                y2: 2,
            },
            {
                x1: 12,
                y1: 2,
                x2: 8,
                y2: 6,
            },
        ],
    ];
    /**
     * Horizontal same angle
     *  --------- * ----------
     */
    var arrays90H = [
        /*
          1 - from left to right
          2 - from left to right,
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 8,
                y2: 4,
            },
            {
                x1: 8,
                y1: 4,
                x2: 12,
                y2: 4,
            },
        ],
        /*
          1 - from right to left
          2 - from left to right,
         */
        [
            {
                x1: 8,
                y1: 4,
                x2: 4,
                y2: 4,
            },
            {
                x1: 8,
                y1: 4,
                x2: 12,
                y2: 4,
            },
        ],
        /*
          1 - from left to right
          2 - from right to left,
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 8,
                y2: 4,
            },
            {
                x1: 12,
                y1: 4,
                x2: 8,
                y2: 4,
            },
        ],
        /*
          1 - from right to left
          2 - from right to left,
         */
        [
            {
                x1: 8,
                y1: 4,
                x2: 4,
                y2: 4,
            },
            {
                x1: 12,
                y1: 4,
                x2: 8,
                y2: 4,
            },
        ],
    ];
    /**
     *  Vertical same angle
     *    |
     *    |
     *    |
     *    *
     *    |
     *    |
     *    |
     */
    var arrays90V = [
        /*
          1 - from top to bottom
          2 - from top to bottom
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 4,
                y2: 8,
            },
            {
                x1: 4,
                y1: 8,
                x2: 4,
                y2: 12,
            },
        ],
        /*
          1 - from bottom to top
          2 - from top to bottom
         */
        [
            {
                x1: 4,
                y1: 8,
                x2: 4,
                y2: 4,
            },
            {
                x1: 4,
                y1: 8,
                x2: 4,
                y2: 12,
            },
        ],
        /*
          1 - from top to bottom
          2 - from bottom to top
         */
        [
            {
                x1: 4,
                y1: 4,
                x2: 4,
                y2: 8,
            },
            {
                x1: 4,
                y1: 12,
                x2: 4,
                y2: 8,
            },
        ],
        /*
          1 - from bottom to top
          2 - from bottom to top
         */
        [
            {
                x1: 4,
                y1: 8,
                x2: 4,
                y2: 4,
            },
            {
                x1: 4,
                y1: 12,
                x2: 4,
                y2: 8,
            },
        ],
    ];
    __spreadArray(__spreadArray([], arraysRL90, true), arraysLR90, true).map(function (lines, index) {
        if (index > 1)
            return;
        lines.map(function (line) {
            pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + line.x1 * step, line.y1 * step), new vect_1.Vector(100 * index + line.x2 * step, line.y2 * step)));
        });
    });
    return;
    __spreadArray(__spreadArray([], arraysV90Down, true), arraysV90Up, true).map(function (lines, index) {
        lines.map(function (line) {
            pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + line.x1 * step, 12 * step + line.y1 * step), new vect_1.Vector(100 * index + line.x2 * step, 12 * step + line.y2 * step)));
        });
    });
    arrays90H.map(function (lines, index) {
        lines.map(function (line) {
            pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + line.x1 * step, 18 * step + line.y1 * step), new vect_1.Vector(100 * index + line.x2 * step, 18 * step + line.y2 * step)));
        });
    });
    arrays90V.map(function (lines, index) {
        lines.map(function (line) {
            pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + line.x1 * step, 22 * step + line.y1 * step), new vect_1.Vector(100 * index + line.x2 * step, 22 * step + line.y2 * step)));
        });
    });
    [0, 30, 60, 90].map(function (a, index) {
        var pV1 = new vect_1.Vector(4, 4);
        var pV2 = new vect_1.Vector(8, 4).rotate(a, pV1);
        var v1 = new vect_1.Vector(pV2.x, pV2.y);
        var v2 = new vect_1.Vector(pV2.x + 4, pV2.y).rotate(a, v1);
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(400 + 100 * index + pV1.x * step, 22 * step + pV1.y * step), new vect_1.Vector(400 + 100 * index + pV2.x * step, 22 * step + pV2.y * step)));
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(400 + 100 * index + v1.x * step, 22 * step + v1.y * step), new vect_1.Vector(400 + 100 * index + v2.x * step, 22 * step + v2.y * step)));
    });
    // horizontal line with angles
    [0, 30, 60, 90, 120, 150, 180].map(function (a, index) {
        var pV1 = new vect_1.Vector(4, 4);
        var pV2 = new vect_1.Vector(8, 4);
        var v1 = new vect_1.Vector(8, 4);
        var v2 = new vect_1.Vector(12, 4).rotate(a, v1);
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + pV1.x * step, 32 * step + pV1.y * step), new vect_1.Vector(100 * index + pV2.x * step, 32 * step + pV2.y * step)));
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + v1.x * step, 32 * step + v1.y * step), new vect_1.Vector(100 * index + v2.x * step, 32 * step + v2.y * step)));
    });
    [0, -30, -60, -90, -120, -150, -180].map(function (a, index) {
        var pV1 = new vect_1.Vector(4, 4);
        var pV2 = new vect_1.Vector(8, 4);
        var v1 = new vect_1.Vector(8, 4);
        var v2 = new vect_1.Vector(12, 4).rotate(a, v1);
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + pV1.x * step, 42 * step + pV1.y * step), new vect_1.Vector(100 * index + pV2.x * step, 42 * step + pV2.y * step)));
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + v1.x * step, 42 * step + v1.y * step), new vect_1.Vector(100 * index + v2.x * step, 42 * step + v2.y * step)));
    });
};
var _3Pipes = function (model, pipes, step) {
    var combinationGroupOffset = step * 2;
    var yOffsetStep = 10;
    /**
     *   90 angle down
     *
     *   --------- * ----------
     *             |
     *             |
     *             |
     */
    [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
    ].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                }
                else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            }
            else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 8);
                }
                else {
                    vec1 = new vect_1.Vector(8, 8);
                    vec2 = new vect_1.Vector(8, 4);
                }
            }
            else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(12, 4);
                }
                else {
                    vec1 = new vect_1.Vector(12, 4);
                    vec2 = new vect_1.Vector(8, 4);
                }
            }
            var offsetX = 100 * (combinationIndex % 8);
            var offsetY = combinationGroupOffset;
            vec1.x = offsetX + vec1.x * step;
            vec1.y = offsetY + vec1.y * step;
            vec2.x = offsetX + vec2.x * step;
            vec2.y = offsetY + vec2.y * step;
            pipes.push(new pipe_model_1.default(model, vec1, vec2));
        });
    });
    combinationGroupOffset += yOffsetStep * step;
    /**
     *   90 angle up
     *
     *             |
     *             |
     *             |
     *   --------- * ----------
     */
    [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
    ].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                }
                else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            }
            else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 0);
                }
                else {
                    vec1 = new vect_1.Vector(8, 0);
                    vec2 = new vect_1.Vector(8, 4);
                }
            }
            else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(12, 4);
                }
                else {
                    vec1 = new vect_1.Vector(12, 4);
                    vec2 = new vect_1.Vector(8, 4);
                }
            }
            var offsetX = 100 * (combinationIndex % 8);
            var offsetY = combinationGroupOffset;
            vec1.x = offsetX + vec1.x * step;
            vec1.y = offsetY + vec1.y * step;
            vec2.x = offsetX + vec2.x * step;
            vec2.y = offsetY + vec2.y * step;
            pipes.push(new pipe_model_1.default(model, vec1, vec2));
        });
    });
    combinationGroupOffset += yOffsetStep * step;
    /**
     *   90 angle left
     *
     *              |
     *              |
     *    --------- *
     *              |
     *              |
     *
     */
    [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
    ].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 0);
                    vec2 = new vect_1.Vector(8, 4);
                }
                else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 0);
                }
            }
            else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                }
                else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            }
            else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 8);
                }
                else {
                    vec1 = new vect_1.Vector(8, 8);
                    vec2 = new vect_1.Vector(8, 4);
                }
            }
            var offsetX = 100 * (combinationIndex % 8);
            var offsetY = combinationGroupOffset;
            vec1.x = offsetX + vec1.x * step;
            vec1.y = offsetY + vec1.y * step;
            vec2.x = offsetX + vec2.x * step;
            vec2.y = offsetY + vec2.y * step;
            pipes.push(new pipe_model_1.default(model, vec1, vec2));
        });
    });
    combinationGroupOffset += yOffsetStep * step;
    /**
     *   90 angle right
     *
     *    |
     *    |
     *    *---------
     *    |
     *    |
     *
     */
    [
        [1, 1, 1],
        [1, 1, -1],
        [1, -1, 1],
        [1, -1, -1],
        [-1, 1, 1],
        [-1, 1, -1],
        [-1, -1, 1],
        [-1, -1, -1],
    ].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 0);
                    vec2 = new vect_1.Vector(4, 4);
                }
                else {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(4, 0);
                }
            }
            else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                }
                else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            }
            else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(4, 8);
                }
                else {
                    vec1 = new vect_1.Vector(4, 8);
                    vec2 = new vect_1.Vector(4, 4);
                }
            }
            var offsetX = 100 * (combinationIndex % 8);
            var offsetY = combinationGroupOffset;
            vec1.x = offsetX + vec1.x * step;
            vec1.y = offsetY + vec1.y * step;
            vec2.x = offsetX + vec2.x * step;
            vec2.y = offsetY + vec2.y * step;
            pipes.push(new pipe_model_1.default(model, vec1, vec2));
        });
    });
    combinationGroupOffset += yOffsetStep * step;
};
