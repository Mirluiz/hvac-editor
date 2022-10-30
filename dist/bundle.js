(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var stats_view_1 = __importDefault(require("../views/stats.view"));
var vect_1 = require("../../geometry/vect");
var pipe_controller_1 = __importDefault(require("./pipe.controller"));
var Canvas = /** @class */function () {
    function Canvas() {
        this.model = new canvas_model_1.default();
        this.view = new canvas_view_1.default(this.model);
        this.stats = new stats_view_1.default(this.model);
        this.pipe = new pipe_controller_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener("mousemove", this.mouseMove.bind(this));
            this.view.container.addEventListener("mousedown", this.mouseDown.bind(this));
            this.view.container.addEventListener("mouseup", this.mouseUp.bind(this));
            this.view.container.addEventListener("wheel", this.mouseWheel.bind(this));
            document.addEventListener("keyup", this.keyUp.bind(this));
        }
    }
    Canvas.prototype.mouseWheel = function (e) {
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseDown = function (e) {
        this.model.clicked = true;
        if (!this.model.mouse) return;
        var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        if (this.model.config.net.bind) {
            _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
            _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
        }
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseDown(_mouse);
                break;
            case "valve":
                break;
        }
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseMove = function (e) {
        if (!this.model.mouse) {
            this.model.mouse = {
                x: e.offsetX,
                y: e.offsetY
            };
        } else {
            this.model.mouse.x = e.offsetX;
            this.model.mouse.y = e.offsetY;
        }
        var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        if (this.model.config.net.bind) {
            _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
            _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
        }
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseMove(_mouse);
                break;
            case "valve":
                break;
        }
        this.model.overlap.update(_mouse);
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseUp = function (e) {
        this.model.clicked = false;
        if (!this.model.mouse) return;
        var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
        if (this.model.config.net.bind) {
            _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
            _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
        }
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseUp(_mouse);
                break;
            case "valve":
                break;
        }
    };
    Canvas.prototype.keyUp = function (e) {
        if (e.key === "Escape") {
            this.model.actionMode = null; // Todo: future reset place here;
            this.reset();
        }
    };
    Canvas.prototype.reset = function () {
        this.model.actionObject = null;
        this.stats.render();
        this.view.draw();
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":20,"../models/canvas.model":5,"../views/canvas.view":13,"../views/stats.view":17,"./pipe.controller":3}],2:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mode_view_1 = __importDefault(require("../views/mode.view"));
var Mode = /** @class */function () {
    function Mode(model) {
        this.model = model;
        this.view = new mode_view_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener("click", this.handleMode.bind(this));
        }
        if (this.view.subContainer) {
            this.view.subContainer.addEventListener("click", this.handleSubMode.bind(this));
        }
    }
    Mode.prototype.handleMode = function (e) {
        var cT = e.target;
        var value = cT.value;
        if (value === "default" || value === "wall" || value === "pipe" || value === "valve") {
            this.model.mode = value;
        }
    };
    Mode.prototype.handleSubMode = function (e) {
        var cT = e.target;
        var value = cT.value;
        if (value === "supply" || value === "return") {
            this.model.subMode = value;
        }
    };
    return Mode;
}();
exports.default = Mode;

},{"../views/mode.view":15}],3:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_model_1 = __importDefault(require("../models/ghost/heating/pipe.model"));
var pipe_model_2 = __importDefault(require("../models/heating/pipe.model"));
var Pipe = /** @class */function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function (coord) {
        if (this.model.actionObject && this.model.actionObject instanceof pipe_model_1.default) {
            this.model.actionObject.to.vec.x = coord.x;
            this.model.actionObject.to.vec.y = coord.y;
        }
    };
    Pipe.prototype.mouseDown = function (coord) {
        var _a;
        if (!this.model.actionObject) {
            this.model.actionMode = "pipeLaying";
        }
        if (this.model.actionObject instanceof pipe_model_1.default) {
            var pipe = new pipe_model_2.default(this.model, this.model.actionObject.from.vec.clone(), this.model.actionObject.to.vec.clone());
            pipe.type = (_a = this.model.subMode) !== null && _a !== void 0 ? _a : "supply";
            this.model.addPipe(pipe);
            pipe.update(pipe);
        }
        this.model.actionObject = new pipe_model_1.default(coord.clone(), coord.clone());
    };
    Pipe.prototype.mouseUp = function (coord) {};
    return Pipe;
}();
exports.default = Pipe;

},{"../models/ghost/heating/pipe.model":8,"../models/heating/pipe.model":10}],4:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_controller_1 = __importDefault(require("./controllers/canvas.controller"));
var mode_controller_1 = __importDefault(require("./controllers/mode.controller"));
var Controller = /** @class */function () {
    function Controller() {
        this.canvas = new canvas_controller_1.default();
        this.mode = new mode_controller_1.default(this.canvas.model);
        this.canvas.model.update();
    }
    return Controller;
}();
exports.default = Controller;

},{"./controllers/canvas.controller":1,"./controllers/mode.controller":2}],5:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var pipe_model_1 = __importDefault(require("./heating/pipe.model"));
var overlap_model_1 = __importDefault(require("../overlap.model"));
var Canvas = /** @class */function () {
    function Canvas() {
        var _this = this;
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this._fittings = [];
        this.mode = "pipe";
        this.subMode = null;
        this.actionMode = null;
        this.actionObject = null;
        this.placingObject = null;
        this.mouse = null;
        this.canvasSize = null;
        this.mouseCanvasRatio = null;
        this.scale = {
            amount: 1,
            coord: null,
            limitReached: false
        };
        this.clicked = false;
        this.keyboard = null;
        this.offset = { x: 0, y: 0 };
        this.config = {
            axis: {
                show: true
            },
            net: {
                bind: true,
                show: true,
                step: 20
            },
            overlap: {
                bindDistance: 10
            }
        };
        this.overlap = new overlap_model_1.default(this);
        var arraysForLeftCheck = [
        /*
            1 - from right bottom to top
            2 - from left to right
           */
        [{
            x1: 100,
            y1: 100,
            x2: 100,
            y2: 40
        }, {
            x1: 40,
            y1: 40,
            x2: 100,
            y2: 40
        }],
        /*
                  1 - from right top to left
                  2 - from top to bottom
                 */
        [{
            x1: 100,
            y1: 40,
            x2: 40,
            y2: 40
        }, {
            x1: 100,
            y1: 40,
            x2: 100,
            y2: 100
        }],
        /*
          1 - from left top to right
          2 - from right top to bottom
         */
        [{
            x1: 40,
            y1: 40,
            x2: 100,
            y2: 40
        }, {
            x1: 100,
            y1: 40,
            x2: 100,
            y2: 100
        }],
        /*
        1 - from right bottom to top
        2 - from right to left
        */
        [{
            x1: 100,
            y1: 100,
            x2: 100,
            y2: 40
        }, {
            x1: 100,
            y1: 40,
            x2: 40,
            y2: 40
        }]];
        var arraysForRightCheck = [
        /*
            1 - from bottom to top
            2 - from left to right
           */
        [{
            x1: 40,
            y1: 40,
            x2: 40,
            y2: 100
        }, {
            x1: 40,
            y1: 40,
            x2: 100,
            y2: 40
        }],
        /*
          1 - from right top to left
          2 - from top to bottom
         */
        [{
            x1: 100,
            y1: 40,
            x2: 40,
            y2: 40
        }, {
            x1: 40,
            y1: 40,
            x2: 40,
            y2: 100
        }],
        /*
          1 - from left top to right
          2 - from top to bottom
         */
        [{
            x1: 40,
            y1: 40,
            x2: 100,
            y2: 40
        }, {
            x1: 40,
            y1: 40,
            x2: 40,
            y2: 100
        }],
        /*
        1 - from right to left
        2 - from bottom to top
        */
        [{
            x1: 100,
            y1: 40,
            x2: 40,
            y2: 40
        }, {
            x1: 40,
            y1: 100,
            x2: 40,
            y2: 40
        }]];
        var arrays45Check = [
        /*
            /\
            1 - from left to right,
            2 - from right to left,
           */
        [{
            x1: 40,
            y1: 60,
            x2: 80,
            y2: 20
        }, {
            x1: 120,
            y1: 60,
            x2: 80,
            y2: 20
        }],
        /*
            V
            1 - from left to right,
            2 - from right to left,
           */
        [{
            x1: 40,
            y1: 20,
            x2: 80,
            y2: 60
        }, {
            x1: 120,
            y1: 20,
            x2: 80,
            y2: 60
        }],
        /*
          >
          1 - from left to right,
          2 - from left to right,
         */
        [{
            x1: 40,
            y1: 20,
            x2: 80,
            y2: 60
        }, {
            x1: 40,
            y1: 100,
            x2: 80,
            y2: 60
        }],
        /*
          >
          1 - from right to left,
          2 - from right to left,
         */
        [{
            x1: 80,
            y1: 60,
            x2: 40,
            y2: 20
        }, {
            x1: 80,
            y1: 60,
            x2: 40,
            y2: 100
        }],
        /*
          <
          1 - from left to right,
          2 - from left to right,
         */
        [{
            x1: 40,
            y1: 60,
            x2: 80,
            y2: 20
        }, {
            x1: 40,
            y1: 60,
            x2: 80,
            y2: 100
        }],
        /*
          <
          1 - from right to left,
          2 - from right to left,
         */
        [{
            x1: 80,
            y1: 20,
            x2: 40,
            y2: 60
        }, {
            x1: 80,
            y1: 100,
            x2: 40,
            y2: 60
        }]];
        var arrays90HCheck = [
        /*
            --
            1 - from left to right
            2 - from left to right,
           */
        [{
            x1: 40,
            y1: 40,
            x2: 80,
            y2: 40
        }, {
            x1: 80,
            y1: 40,
            x2: 120,
            y2: 40
        }],
        /*
          --
          1 - from left to right
          2 - from right to left,
         */
        [{
            x1: 40,
            y1: 40,
            x2: 80,
            y2: 40
        }, {
            x1: 120,
            y1: 40,
            x2: 80,
            y2: 40
        }],
        /*
        --
        1 - from right to left
        2 - from left to right,
        */
        [{
            x1: 80,
            y1: 40,
            x2: 40,
            y2: 40
        }, {
            x1: 80,
            y1: 40,
            x2: 120,
            y2: 40
        }],
        /*
        --
          1 - from left to right
          2 - from left to right,
         */
        [{
            x1: 80,
            y1: 40,
            x2: 40,
            y2: 40
        }, {
            x1: 120,
            y1: 40,
            x2: 80,
            y2: 40
        }]];
        var arrays90VCheck = [
        /*
            |
            |
            1 - from top to bottom
            2 - from top to bottom
           */
        [{
            x1: 40,
            y1: 40,
            x2: 40,
            y2: 80
        }, {
            x1: 40,
            y1: 80,
            x2: 40,
            y2: 120
        }],
        /*
          |
          |
          1 - from top to bottom
          2 - from bottom to top
         */
        [{
            x1: 40,
            y1: 40,
            x2: 40,
            y2: 80
        }, {
            x1: 40,
            y1: 120,
            x2: 40,
            y2: 80
        }],
        /*
          |
          |
          1 - from bottom to top
          2 - from top to bottom
         */
        [{
            x1: 40,
            y1: 80,
            x2: 40,
            y2: 40
        }, {
            x1: 40,
            y1: 80,
            x2: 40,
            y2: 120
        }],
        /*
          |
          |
          1 - from bottom to top
          2 - from bottom to top
         */
        [{
            x1: 40,
            y1: 80,
            x2: 40,
            y2: 40
        }, {
            x1: 40,
            y1: 120,
            x2: 40,
            y2: 80
        }]];
        arraysForLeftCheck.map(function (lines, index) {
            lines.map(function (line) {
                _this.pipes.push(new pipe_model_1.default(_this, new vect_1.Vector(100 * index + line.x1, line.y1), new vect_1.Vector(100 * index + line.x2, line.y2)));
            });
        });
        arraysForRightCheck.map(function (lines, index) {
            lines.map(function (line) {
                _this.pipes.push(new pipe_model_1.default(_this, new vect_1.Vector(100 * index + line.x1, 100 + line.y1), new vect_1.Vector(100 * index + line.x2, 100 + line.y2)));
            });
        });
        arrays45Check.map(function (lines, index) {
            lines.map(function (line) {
                _this.pipes.push(new pipe_model_1.default(_this, new vect_1.Vector(100 * index + line.x1, 300 + line.y1), new vect_1.Vector(100 * index + line.x2, 300 + line.y2)));
            });
        });
        arrays90HCheck.map(function (lines, index) {
            lines.map(function (line) {
                _this.pipes.push(new pipe_model_1.default(_this, new vect_1.Vector(100 * index + line.x1, 400 + line.y1), new vect_1.Vector(100 * index + line.x2, 400 + line.y2)));
            });
        });
        arrays90VCheck.map(function (lines, index) {
            lines.map(function (line) {
                _this.pipes.push(new pipe_model_1.default(_this, new vect_1.Vector(500 + 100 * index + line.x1, line.y1), new vect_1.Vector(500 + 100 * index + line.x2, line.y2)));
            });
        });
        // this.pipes.push(new Pipe(this, new Vector(40, 100), new Vector(300, 100)));
        // this.pipes.push(new Pipe(this, new Vector(300, 100), new Vector(300, 500)));
        //
        // this.pipes.push(new Pipe(this, new Vector(600, 100), new Vector(700, 100)));
        // this.pipes.push(new Pipe(this, new Vector(700, 500), new Vector(700, 100)));
        // this.pipes.push(new Pipe(new Vector(40, 200), new Vector(100, 260)));
        // this.pipes.push(new Pipe(new Vector(40, 380), new Vector(100, 320)));
    }
    Object.defineProperty(Canvas.prototype, "walls", {
        get: function get() {
            return this._walls;
        },
        set: function set(value) {
            this._walls = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "pipes", {
        get: function get() {
            return this._pipes;
        },
        set: function set(value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "valves", {
        get: function get() {
            return this._valves;
        },
        set: function set(value) {
            this._valves = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Canvas.prototype, "fittings", {
        get: function get() {
            return this._fittings;
        },
        set: function set(value) {
            this._fittings = value;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.addWall = function (wall) {
        this.walls.push(wall);
        this.walls = this.walls;
        return wall;
    };
    Canvas.prototype.addPipe = function (pipe) {
        this.pipes.push(pipe);
        this.pipes = this.pipes;
        return this.pipes[this.pipes.length - 1];
    };
    Canvas.prototype.addFitting = function (fitting) {
        this.fittings.push(fitting);
        this.fittings = this.fittings;
        return this.fittings[this.fittings.length - 1];
    };
    Canvas.prototype.getPipeByID = function (id) {
        return this.pipes.find(function (p) {
            return p.id === id;
        });
    };
    Canvas.prototype.update = function () {
        var _this = this;
        this.pipes.map(function (pipe) {
            _this.pipes.map(function (_pipe) {
                if (_pipe.id === pipe.id) return;
                if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
                    pipe.merge(_pipe);
                }
            });
            _this.fittings.map(function (fitting) {
                if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
                    pipe.connect(fitting);
                }
                if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
                    pipe.connect(fitting);
                }
            });
        });
    };
    Canvas.prototype.deletePipe = function (id) {
        this.pipes = this.pipes.filter(function (p) {
            return p.id !== id;
        });
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":20,"../overlap.model":12,"./heating/pipe.model":10}],6:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var main_model_1 = __importDefault(require("../main.model"));
var Arc = /** @class */function (_super) {
    __extends(Arc, _super);
    function Arc(center) {
        var _this = _super.call(this) || this;
        _this.radius = 5;
        _this.color = "#fff";
        _this.width = 10;
        _this.center = center;
        return _this;
    }
    return Arc;
}(main_model_1.default);
exports.default = Arc;

},{"../main.model":11}],7:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var main_model_1 = __importDefault(require("../main.model"));
var Line = /** @class */function (_super) {
    __extends(Line, _super);
    function Line(from, to) {
        var _this = _super.call(this) || this;
        _this.width = 1;
        _this.from = from;
        _this.to = to;
        return _this;
    }
    return Line;
}(main_model_1.default);
exports.default = Line;

},{"../main.model":11}],8:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var line_model_1 = __importDefault(require("../../geometry/line.model"));
var Pipe = /** @class */function (_super) {
    __extends(Pipe, _super);
    function Pipe(from, to) {
        return _super.call(this, { vec: from }, { vec: to }) || this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function get() {
            return "pink";
        },
        enumerable: false,
        configurable: true
    });
    return Pipe;
}(line_model_1.default);
exports.default = Pipe;

},{"../../geometry/line.model":7}],9:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var arc_model_1 = __importDefault(require("../geometry/arc.model"));
var Fitting = /** @class */function (_super) {
    __extends(Fitting, _super);
    function Fitting(model, center) {
        var _this = _super.call(this, center) || this;
        _this._pipes = [];
        _this.color = "black";
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Fitting.prototype, "pipes", {
        get: function get() {
            return this._pipes;
        },
        set: function set(value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Fitting.prototype, "type", {
        get: function get() {
            var ret = null;
            if (this.pipes.length === 2) ret = "2d";
            if (this.pipes.length === 3) ret = "3d";
            if (this.pipes.length === 4) ret = "4d";
            console.log("", this.pipes.length);
            return ret;
        },
        enumerable: false,
        configurable: true
    });
    Fitting.prototype.isClose = function (v) {
        var distance = this.model.config.overlap.bindDistance;
        return this.center.sub(v).length <= distance;
    };
    Fitting.prototype.addPipe = function (pipe) {
        this._pipes.push(pipe);
        this.pipes = this._pipes;
        return this.pipes[this.pipes.length - 1];
    };
    return Fitting;
}(arc_model_1.default);
exports.default = Fitting;

},{"../geometry/arc.model":6}],10:[function(require,module,exports){
"use strict";

var __extends = undefined && undefined.__extends || function () {
    var _extendStatics = function extendStatics(d, b) {
        _extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
            d.__proto__ = b;
        } || function (d, b) {
            for (var p in b) {
                if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
            }
        };
        return _extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        _extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../../geometry/vect");
var line_model_1 = __importDefault(require("../geometry/line.model"));
var fitting_model_1 = __importDefault(require("./fitting.model"));
var Pipe = /** @class */function (_super) {
    __extends(Pipe, _super);
    function Pipe(model, from, to) {
        var _this = _super.call(this, { target: null, vec: from }, { target: null, vec: to }) || this;
        _this.type = "supply";
        _this.width = 10;
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function get() {
            return this.type === "supply" ? "red" : "blue";
        },
        enumerable: false,
        configurable: true
    });
    Pipe.prototype.toOrigin = function () {
        return this.to.vec.sub(this.from.vec);
    };
    Pipe.prototype.update = function (pipe) {
        this.model.pipes.map(function (_pipe) {
            if (_pipe.id === pipe.id) return;
            if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
                pipe.merge(_pipe);
            }
        });
        this.model.fittings.map(function (fitting) {
            if (fitting.isClose(pipe.from.vec) || fitting.isClose(pipe.to.vec)) {
                pipe.connect(fitting);
            }
        });
    };
    Pipe.prototype.merge = function (pipe) {
        var _this = this;
        var distance = this.model.config.overlap.bindDistance;
        var merged = false;
        var run = function run(end) {
            if (_this.id === pipe.id) return;
            if (pipe.isClose(end.vec)) {
                var mergePoint = void 0;
                if (pipe.from.vec.sub(end.vec).length <= distance) {
                    if (pipe.from.target) return;
                    mergePoint = pipe.from.vec.clone();
                    var newFitting_1 = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting_1);
                    newFitting_1.addPipe(pipe);
                    newFitting_1.addPipe(_this);
                    pipe.from.target = newFitting_1;
                    end.target = newFitting_1;
                    return;
                } else if (pipe.to.vec.sub(end.vec).length <= distance) {
                    if (pipe.to.target) return;
                    mergePoint = pipe.to.vec.clone();
                    var newFitting_2 = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting_2);
                    newFitting_2.addPipe(pipe);
                    newFitting_2.addPipe(_this);
                    pipe.to.target = newFitting_2;
                    end.target = newFitting_2;
                    return;
                }
                var normPipe = pipe.toOrigin().normalize();
                var projPipe = pipe.toOrigin().projection(end.vec.sub(pipe.from.vec));
                mergePoint = normPipe.multiply(projPipe).sum(pipe.from.vec);
                mergePoint = mergePoint.bindNet(_this.model.config.net.step);
                var newP1 = new Pipe(_this.model, new vect_1.Vector(0, 0).sum(pipe.from.vec), new vect_1.Vector(mergePoint.x, mergePoint.y));
                var newP2 = new Pipe(_this.model, new vect_1.Vector(mergePoint.x, mergePoint.y), new vect_1.Vector(pipe.to.vec.x, pipe.to.vec.y));
                _this.model.addPipe(newP1);
                _this.model.addPipe(newP2);
                pipe.delete();
                var newFitting = new fitting_model_1.default(_this.model, mergePoint);
                _this.model.addFitting(newFitting);
                newFitting.addPipe(newP1);
                newFitting.addPipe(newP2);
                newP1.from.target = pipe.from.target;
                newP1.to.target = newFitting;
                newP2.from.target = newFitting;
                newP2.to.target = pipe.to.target;
                merged = true;
            }
        };
        run(this.from);
        run(this.to);
        return merged;
    };
    Pipe.prototype.connect = function (target) {
        var merged = false;
        if (target instanceof fitting_model_1.default) {
            var isFrom = target.isClose(this.from.vec);
            var isTo = target.isClose(this.to.vec);
            if (isFrom || isTo) {
                target.addPipe(this);
                merged = true;
            }
            if (isFrom) {
                this.from.target = target;
            } else if (isTo) this.to.target = target;
            return merged;
        }
        return merged;
    };
    Pipe.prototype.isClose = function (end) {
        var distance = this.model.config.overlap.bindDistance;
        return this.from.vec.sub(end).length <= distance || this.to.vec.sub(end).length <= distance || end.distanceToLine(this) <= distance;
    };
    Pipe.prototype.delete = function () {
        var _this = this;
        this.model.pipes = this.model.pipes.filter(function (_p) {
            return _p.id !== _this.id;
        });
    };
    return Pipe;
}(line_model_1.default);
exports.default = Pipe;

},{"../../../geometry/vect":20,"../geometry/line.model":7,"./fitting.model":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var Main = /** @class */function () {
    function Main() {
        this.id = (0, utils_1.uuid)();
    }
    return Main;
}();
exports.default = Main;

},{"../../utils":22}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../geometry/vect");
var Overlap = /** @class */function () {
    function Overlap(model) {
        this.mouse = null;
        this.netBoundMouse = null;
        this.walls = [];
        this.pipes = [];
        this.valves = [];
        this.list = [];
        this.netBoundList = [];
        this.model = model;
    }
    Overlap.prototype.update = function (mouse) {
        this.mouse = mouse;
        this.wallsOverlap();
        this.pipeOverlap();
        this.updateList();
        // this.updateNetBoundList();
    };
    Overlap.prototype.wallsOverlap = function () {
        this.model.walls.map(function () {});
    };
    Overlap.prototype.pipeOverlap = function () {
        var _this = this;
        this.pipes = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.pipes.map(function (pipe) {
            if (!_this.mouse) return;
            var _p = null;
            if (pipe.from.vec.sub(_this.mouse).length <= bind) {
                _p = {
                    type: "pipe",
                    id: pipe.id,
                    ioVector: new vect_1.Vector(pipe.from.vec.x, pipe.from.vec.y)
                };
            }
            if (!_p && pipe.to.vec.sub(_this.mouse).length <= bind) {
                _p = {
                    type: "pipe",
                    id: pipe.id,
                    ioVector: new vect_1.Vector(pipe.to.vec.x, pipe.to.vec.y)
                };
            }
            if (!_p) {
                var l = _this.mouse.distanceToLine(pipe);
                if (l <= bind) {
                    var normPipe = pipe.toOrigin().normalize();
                    var projPipe = pipe.toOrigin().projection(_this.mouse.sub(pipe.from.vec));
                    _p = {
                        type: "pipe",
                        id: pipe.id,
                        ioVector: normPipe.multiply(projPipe).sum(pipe.from.vec)
                    };
                }
            }
            if (_p) _this.pipes.push(_p);
        });
    };
    Overlap.prototype.updateList = function () {
        var _a;
        this.list = [];
        (_a = this.list).push.apply(_a, this.pipes);
    };
    return Overlap;
}();
exports.default = Overlap;

},{"../geometry/vect":20}],13:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var pipe_view_1 = __importDefault(require("./pipe.view"));
var valve_view_1 = __importDefault(require("./valve.view"));
var fitting_view_1 = __importDefault(require("./fitting.view"));
var Canvas = /** @class */function () {
    function Canvas(model) {
        this.pipe = null;
        this.valve = null;
        this.fitting = null;
        this.model = model;
        this.container = document.querySelector("#editor");
        this.init();
    }
    Canvas.prototype.init = function () {
        var _a;
        this.initCanvasContainer();
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (ctx) {
            this.pipe = new pipe_view_1.default(this, this.model, ctx);
            this.valve = new valve_view_1.default(this, this.model, ctx);
            this.fitting = new fitting_view_1.default(this, this.model, ctx);
        }
    };
    Canvas.prototype.draw = function () {
        var _a, _b, _c;
        this.clear();
        this.drawNet();
        this.drawWalls();
        (_a = this.pipe) === null || _a === void 0 ? void 0 : _a.draw();
        (_b = this.valve) === null || _b === void 0 ? void 0 : _b.draw();
        (_c = this.fitting) === null || _c === void 0 ? void 0 : _c.draw();
    };
    Canvas.prototype.clear = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container) return;
        ctx.clearRect(0, 0, this.container.width, this.container.height);
    };
    Canvas.prototype.drawMouse = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse) return;
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.lineWidth = 2;
        ctx.arc(this.model.mouse.x, this.model.mouse.y, 1, 0, 2 * Math.PI);
        ctx.restore();
    };
    Canvas.prototype.drawNet = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container) return;
        if (!this.model.config.net.show) return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        var step = this.model.config.net.step * this.model.scale.amount;
        var h = this.container.height;
        var w = this.container.width;
        var netOffset = new vect_1.Vector(this.model.offset.x % step, this.model.offset.y % step);
        //x
        var iV = 0;
        var maxV = w / step;
        while (iV <= maxV) {
            var from = new vect_1.Vector(step * iV + netOffset.x, 0);
            var to = new vect_1.Vector(step * iV + netOffset.x, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        //y
        var iH = 0;
        var maxH = h / step;
        while (iH <= maxH) {
            var from = new vect_1.Vector(0, step * iH + netOffset.y);
            var to = new vect_1.Vector(w, step * iH + netOffset.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iH++;
        }
        ctx.globalAlpha = 0.2;
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawNet1 = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container) return;
        if (!this.model.config.net.show) return;
        ctx.save();
        ctx.beginPath();
        ctx.lineWidth = 1;
        // let step = this.model.config.net.step * this.model.scale.amount;
        var step = this.model.config.net.step;
        var h = this.container.height;
        var w = this.container.width;
        //x
        var iV = 0;
        var maxV = w / step;
        while (iV <= maxV) {
            var from = this.getWorldCoordinates(step * iV, 0);
            var to = this.getWorldCoordinates(step * iV, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        //y
        var iH = 0;
        var maxH = h / step;
        while (iH <= maxH) {
            var from = this.getWorldCoordinates(0, step * iH);
            var to = this.getWorldCoordinates(w, step * iH);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iH++;
        }
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawAxis = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container) return;
        if (!this.model.config.axis.show) return;
        ctx.save();
        ctx.beginPath();
        var h = this.container.height;
        var w = this.container.width;
        var x_From = this.getWorldCoordinates(0, 0);
        var x_To = this.getWorldCoordinates(w, 0);
        var y_From = this.getWorldCoordinates(0, 0);
        var y_To = this.getWorldCoordinates(0, h);
        ctx.moveTo(0, x_From.y);
        ctx.lineTo(w, x_To.y);
        ctx.moveTo(y_From.x, 0);
        ctx.lineTo(y_To.x, h);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawWalls = function () {
        var _this_1 = this;
        var walls = this.model.walls;
        walls === null || walls === void 0 ? void 0 : walls.map(function (wall) {
            if (!_this_1.container) return;
            var ctx = _this_1.container.getContext("2d");
            if (!ctx) return;
            ctx.save();
            ctx.beginPath();
            var from = _this_1.getWorldCoordinates(wall.from.x, wall.from.y);
            var to = _this_1.getWorldCoordinates(wall.from.x, wall.from.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = wall.color;
            ctx.lineWidth = wall.width;
            ctx.stroke();
            ctx.restore();
        });
    };
    //TODO: apply scale transformation here
    Canvas.prototype.getWorldCoordinates = function (x, y) {
        var _this = this;
        var scale = function scale(vec) {
            return new vect_1.Vector(vec.x * _this.model.scale.amount, vec.y * _this.model.scale.amount);
        };
        var translate = function (vec) {
            return new vect_1.Vector(vec.x + _this.model.offset.x, vec.y + _this.model.offset.y);
        }.bind(this);
        var t = new vect_1.Vector(x, y);
        t = scale(t);
        // t = rotation(t); TODO order is scaling rotation translation
        t = translate(t);
        return t;
    };
    //x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord.x,
    //       y: (y + this.model.offset.y)  * this.model.scale.amount,
    // getLocalCoordinates(x: number, y: number) {
    //   return {
    //     x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord ,
    //     y: (y + this.model.offset.y)  * this.model.scale.amount,
    //   };
    // }
    Canvas.prototype.initCanvasContainer = function () {
        if (!this.container) return;
        this.container.style.height = "600px";
        this.container.style.width = "900px";
        this.container.height = 600;
        this.container.width = 900;
        this.container.style.border = "1px solid black";
        this.model.canvasSize = {
            y: 600,
            x: 900
        };
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":20,"./fitting.view":14,"./pipe.view":16,"./valve.view":18}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var Fitting = /** @class */function () {
    function Fitting(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Fitting.prototype.drawFittings = function () {
        var _this = this;
        console.log("this.canvas.model.fittings", this.canvas.model.fittings);
        this.canvas.model.fittings.map(function (fitting) {
            _this.drawFitting(fitting);
        });
    };
    Fitting.prototype.drawFitting = function (fitting) {
        var _a, _b, _c, _d;
        this.ctx.save();
        this.ctx.beginPath();
        // let c = this.canvas.getWorldCoordinates(fitting.center.x, fitting.center.y);
        // this.ctx.arc(c.x, c.y, fitting.radius, 0, 2 * Math.PI);
        switch (fitting.type) {
            case "2d":
                var pipe1 = fitting.pipes[0];
                var pipe2 = fitting.pipes[1];
                var pipe1End = void 0,
                    pipe1OppositeEnd = void 0,
                    pipe2End = void 0,
                    pipe2OppositeEnd = void 0;
                if (((_a = pipe1.from.target) === null || _a === void 0 ? void 0 : _a.id) === fitting.id) {
                    pipe1End = pipe1.from;
                    pipe1OppositeEnd = pipe1.to;
                } else if (((_b = pipe1.to.target) === null || _b === void 0 ? void 0 : _b.id) === fitting.id) {
                    pipe1End = pipe1.to;
                    pipe1OppositeEnd = pipe1.from;
                }
                if (((_c = pipe2.from.target) === null || _c === void 0 ? void 0 : _c.id) === fitting.id) {
                    pipe2End = pipe2.from;
                    pipe2OppositeEnd = pipe2.to;
                } else if (((_d = pipe2.to.target) === null || _d === void 0 ? void 0 : _d.id) === fitting.id) {
                    pipe2End = pipe2.to;
                    pipe2OppositeEnd = pipe2.from;
                }
                if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd) break;
                var angleBetween = pipe1OppositeEnd.vec.sub(fitting.center).normalize().sum(pipe2OppositeEnd.vec.sub(fitting.center).normalize());
                // let pipe1Angle = pipe1.to.vec.sub(pipe1.from.vec).angle();
                // let pipe2Angle = pipe2.to.vec.sub(pipe2.from.vec).angle();
                var pipe1Angle = pipe1End.vec.sub(pipe1OppositeEnd.vec).angle();
                var pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
                // let v1 = new Vector(Math.cos(pipe1Angle), Math.sin(pipe1Angle));
                // let v2 = new Vector(Math.cos(pipe2Angle), Math.sin(pipe2Angle));
                // let v1 = pipe1.to.vec.sub(pipe1.from.vec).normalize();
                // let v2 = pipe2.to.vec.sub(pipe2.from.vec).normalize();
                var v1 = pipe1End.vec.sub(pipe1OppositeEnd.vec).normalize();
                var v2 = pipe2End.vec.sub(pipe2OppositeEnd.vec).normalize();
                // let v1 = pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize();
                // let v2 = pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize();
                var r1 = v1.multiply(20);
                var r2 = v2.multiply(20);
                var pipe1Width = r1.perpendicular();
                var pipe2Width = r2.perpendicular();
                var pipe1NeckTop = pipe1End.vec.sub(r1).sum(pipe1Width);
                var pipe1NeckBottom = pipe1End.vec.sub(r1).sub(pipe1Width);
                var pipe2NeckTop = pipe2End.vec.sub(r2).sub(pipe2Width);
                var pipe2NeckBottom = pipe2End.vec.sub(r2).sum(pipe2Width);
                var topCurve = new vect_1.Vector(-angleBetween.x, -angleBetween.y).multiply(fitting.width).sum(fitting.center);
                var bottomCurve = new vect_1.Vector(angleBetween.x, angleBetween.y).multiply(fitting.width).sum(fitting.center);
                // let needBezier = Math.round(angleBetween.angle() % 180) < Number.EPSILON;
                var points = [pipe1NeckTop, pipe1NeckBottom, pipe2NeckTop, pipe2NeckBottom];
                points = points.sort(function (a, b) {
                    return (a.x - fitting.center.x) * (b.y - fitting.center.y) - (b.x - fitting.center.x) * (a.y - fitting.center.y);
                });
                this.ctx.moveTo(points[0].x, points[0].y);
                this.ctx.lineTo(points[1].x, points[1].y);
                this.ctx.lineTo(points[2].x, points[2].y);
                this.ctx.lineTo(points[3].x, points[3].y);
                this.ctx.bezierCurveTo(topCurve.x, topCurve.y, topCurve.x, topCurve.y, points[0].x, points[0].y);
                this.ctx.closePath();
                this.ctx.stroke();
                // this.ctx.fillStyle = "black";
                // this.ctx.fill();
                break;
            case "3d":
                console.log("3d");
                break;
            case "4d":
                console.log("4d");
                break;
            default:
                console.warn("no type");
        }
        // this.ctx.fillStyle = fitting.color;
        // this.ctx.fill();
        this.ctx.restore();
    };
    Fitting.prototype.draw = function () {
        this.drawFittings();
    };
    return Fitting;
}();
exports.default = Fitting;

},{"../../geometry/vect":20}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Mode = /** @class */function () {
    function Mode(model) {
        this.model = model;
        this.container = document.querySelector("#mode");
        this.subContainer = document.querySelector("#subMode");
    }
    return Mode;
}();
exports.default = Mode;

},{}],16:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pipe_model_1 = __importDefault(require("../models/ghost/heating/pipe.model"));
var Pipe = /** @class */function () {
    function Pipe(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Pipe.prototype.drawPipes = function () {
        var _this = this;
        this.canvas.model.pipes.map(function (p) {
            _this.drawPipe(p);
        });
    };
    Pipe.prototype.drawPipe = function (pipe) {
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.getWorldCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.getWorldCoordinates(pipe.to.vec.x, pipe.to.vec.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width;
        if (this.canvas.model.overlap.list.find(function (l) {
            return l.id === pipe.id;
        })) {
            this.ctx.shadowOffsetX = 4;
            this.ctx.shadowOffsetY = 4;
            this.ctx.shadowBlur = 5;
            this.ctx.shadowColor = "gray";
        }
        this.ctx.stroke();
        this.ctx.restore();
    };
    Pipe.prototype.drawGhost = function (pipe) {
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.getWorldCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.getWorldCoordinates(pipe.to.vec.x, pipe.to.vec.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width * 2;
        this.ctx.stroke();
        this.ctx.restore();
    };
    Pipe.prototype.drawOverLap = function (coordinate) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.getWorldCoordinates(coordinate.x, coordinate.y);
        this.ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = "black";
        this.ctx.fill();
        this.ctx.restore();
    };
    Pipe.prototype.drawOverLaps = function () {
        // this.canvas.model.overlap.list.map((l) => {
        //   if (l) {
        //     let _p = this.canvas.model.getPipeByID(l.id);
        //     if (_p && l.ioVector) {
        //       this.drawOverLap(l.ioVector);
        //     }
        //   }
        // });
    };
    Pipe.prototype.draw = function () {
        this.drawPipes();
        this.drawOverLaps();
        if (this.canvas.model.actionObject && this.canvas.model.actionObject instanceof pipe_model_1.default) {
            this.drawGhost(this.canvas.model.actionObject);
        }
    };
    return Pipe;
}();
exports.default = Pipe;

},{"../models/ghost/heating/pipe.model":8}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Stats = /** @class */function () {
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
        if (!this.container) return;
        this.container.innerHTML = "\n      <div style=\"display: flex; flex-direction: column\">\n        <div>x - ".concat(Math.round(this.model.offset.x), " \n        / y - ").concat(Math.round(this.model.offset.y), "</div>\n        \n        <div>x - ").concat(Math.round((_b = (_a = this.model.mouse) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0), " \n        / y - ").concat(Math.round((_d = (_c = this.model.mouse) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0), "</div>\n        \n        <div>scale - ").concat(this.model.scale.amount, "</div>\n        <div>width - ").concat((_e = this.model.canvasSize) === null || _e === void 0 ? void 0 : _e.x, " / height - ").concat((_f = this.model.canvasSize) === null || _f === void 0 ? void 0 : _f.y, " / </div>\n        <div>ratio x ").concat((_g = this.model.mouseCanvasRatio) === null || _g === void 0 ? void 0 : _g.x, " / y ").concat((_h = this.model.mouseCanvasRatio) === null || _h === void 0 ? void 0 : _h.y, "</div>\n        <div>mode is ").concat(this.model.actionMode, "</div>\n      </div>\n      \n      </div>\n        <div>fitting size is ").concat(this.model.fittings.length, "</div>\n        <div>pipes size is ").concat(this.model.pipes.length, "</div>\n      </div>\n      </div>\n        <div>hovered object ").concat((_j = this.model.getPipeByID(this.model.overlap.list.length > 0 && this.model.overlap.list[0].id ? this.model.overlap.list[0].id : "")) === null || _j === void 0 ? void 0 : _j.id, "</div>\n        <div>pipes size is ").concat(this.model.pipes.length, "</div>\n      </div>\n    ");
    };
    Stats.prototype.initContainer = function () {
        if (!this.container) return;
        this.container.style.height = "450px";
        this.container.style.width = "300px";
        this.container.style.border = "1px solid black";
        this.container.style.marginLeft = "10px";
    };
    return Stats;
}();
exports.default = Stats;

},{}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Valve = /** @class */function () {
    function Valve(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Valve.prototype.drawValves = function () {
        var _this = this;
        this.canvas.model.valves.map(function (v) {
            _this.drawValve(v);
        });
    };
    Valve.prototype.drawValve = function (valve) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.getWorldCoordinates(valve.center.x, valve.center.y);
        this.ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = valve.color;
        this.ctx.fill();
        this.ctx.restore();
    };
    Valve.prototype.draw = function () {
        this.drawValves();
    };
    return Valve;
}();
exports.default = Valve;

},{}],19:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var _2d_1 = __importDefault(require("./2d"));
var App = /** @class */function () {
    function App() {
        this._2d = new _2d_1.default();
    }
    App.prototype.run = function () {
        window.app = this;
    };
    return App;
}();
exports.default = App;

},{"./2d":4}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.prototype.distanceTo = function (v) {
        var _v = new Vector(this.x - v.x, this.y - v.y);
        return _v.length;
    };
    Vector.prototype.distanceToLine = function (l) {
        var ret;
        var lVec = l.to.vec.sub(l.from.vec);
        var vec = this.sub(l.from.vec);
        var angle = vec.angle(lVec);
        if (vec.length === 0) console.warn("ops");
        var p = lVec.product(vec);
        var p1 = vec.product(vec);
        var param = -1;
        if (p !== 0) param = p1 / p;
        if (param < 0) {
            ret = Math.round(vec.length);
        } else if (param > 1) {
            ret = Math.round(lVec.sub(vec).length);
        } else {
            ret = Math.round(Math.sin(angle) * vec.length);
        }
        return ret;
    };
    Object.defineProperty(Vector.prototype, "length", {
        get: function get() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.projection = function (b) {
        return this.product(b) / Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    Vector.prototype.sum = function (v) {
        return new Vector(this.x + v.x, this.y + v.y);
    };
    Vector.prototype.angle = function (v) {
        if (v === void 0) {
            v = undefined;
        }
        if (v) {
            // return Math.atan2(
            //   this.x * v.y - this.y * v.x,
            //   this.x * v.x + this.y * v.y
            // );
            return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
        }
        return Math.atan2(this.y, this.x);
    };
    Vector.prototype.product = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.normalize = function () {
        return new Vector(this.x / this.length, this.y / this.length);
    };
    Vector.prototype.multiply = function (a) {
        return new Vector(this.x * a, this.y * a);
    };
    Vector.prototype.perpendicular = function () {
        return new Vector(this.y, -this.x);
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.bindNet = function (step) {
        return new Vector(Math.round(this.x / step) * step, Math.round(this.y / step) * step);
    };
    Vector.prototype.drawVector = function () {
        var _this = this;
        //debug only
        setTimeout(function () {
            var container = document.querySelector("#editor");
            if (container) {
                var ctx = container.getContext("2d");
                if (!ctx) return;
                ctx.save();
                ctx.arc(_this.x, _this.y, 2, 0, 2 * Math.PI);
                ctx.fillStyle = "black";
                ctx.fill();
                ctx.restore();
            }
        }, 0);
    };
    return Vector;
}();
exports.Vector = Vector;

},{}],21:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var app = new app_1.default();
app.run();

},{"./app":19}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.uuid = void 0;
var uuid = function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
};
exports.uuid = uuid;
// export const isImplementInterface = <T>(object: T): object is T {
//   return ;
// }

},{}]},{},[21])

//# sourceMappingURL=bundle.js.map
