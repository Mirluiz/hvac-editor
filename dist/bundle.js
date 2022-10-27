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
        console.log(this.view);
        if (this.view.container) {
            this.view.container.addEventListener("click", this.mouseDown.bind(this));
        }
    }
    Mode.prototype.mouseDown = function (e) {
        var cT = e.target;
        var value = cT.value;
        if (value === "default" || value === "wall" || value === "pipe" || value === "valve") {
            this.model.mode = value;
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
            this.model.actionObject.end.x = coord.x;
            this.model.actionObject.end.y = coord.y;
        }
    };
    Pipe.prototype.mouseDown = function (coord) {
        if (!this.model.actionObject) {
            this.model.actionMode = "pipeLaying";
        }
        if (this.model.actionObject instanceof pipe_model_1.default) {
            var pipe = new pipe_model_2.default(this.model.actionObject.start.clone(), this.model.actionObject.end.clone());
            this.model.addPipe(pipe);
            this.model.mergeController(pipe, pipe.start);
        }
        var ghostP = new pipe_model_1.default(coord.clone(), coord.clone());
        this.model.actionObject = ghostP;
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
var fitting_model_1 = __importDefault(require("./heating/fitting.model"));
var Canvas = /** @class */function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this._fittings = [];
        this.mode = "pipe";
        this.actionMode = null;
        this.actionObject = null;
        this.placingObject = null;
        this.nearestObject = null;
        this.hoveredObjects = [];
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
                bindDistance: 0
            }
        };
        this.overlap = new overlap_model_1.default(this);
        this.pipes.push(new pipe_model_1.default(new vect_1.Vector(40, 100), new vect_1.Vector(300, 100)));
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
    // update() {
    //   let mergedPipes: Array<Pipe> = [];
    //   let createdFittings: Array<Fitting> = [];
    //
    //   this.pipes.map((p) => {
    //     this.pipes.map((_p) => {
    //       if (_p.id === p.id) return;
    //       let _ = this.pipeMerge(_p, p);
    //       if (_) {
    //         this.pipes = this.pipes.filter((__p) => __p.id !== p.id);
    //
    //         _.pipes.map((p) => {
    //           mergedPipes.push(p);
    //         });
    //
    //         _.fittings.map((f) => {
    //           createdFittings.push(f);
    //         });
    //       }
    //     });
    //   });
    //
    //   if (mergedPipes.length > 0) mergedPipes.map((mP) => this.addPipe(mP));
    //   if (createdFittings.length > 0) {
    //     createdFittings.map((cF) => this.addFitting(cF));
    //   }
    // }
    Canvas.prototype.mergeController = function (p, end) {
        var _this = this;
        this.pipes.map(function (pipe) {
            if (p.id === pipe.id) return;
            if (end.distanceToLine(pipe) <= _this.config.overlap.bindDistance) {
                var normPipe = pipe.toOrigin().normalize();
                var projPipe = pipe.toOrigin().projection(end.sub(pipe.start));
                var mergePoint = normPipe.multiply(projPipe).sum(pipe.start);
                var newP1 = new pipe_model_1.default(new vect_1.Vector(0, 0).sum(pipe.start), new vect_1.Vector(mergePoint.x, mergePoint.y));
                var newP2 = new pipe_model_1.default(new vect_1.Vector(mergePoint.x, mergePoint.y), new vect_1.Vector(pipe.end.x, pipe.end.y));
                _this.addPipe(newP1);
                _this.addPipe(newP2);
                _this.pipes = _this.pipes.filter(function (_p) {
                    return _p.id !== pipe.id;
                });
                var newFitting = new fitting_model_1.default(mergePoint);
                _this.addFitting(newFitting);
            }
        });
    };
    Canvas.prototype.pipeMerge = function (pipe1, pipe2) {
        if (pipe1.id === pipe2.id) return false;
        var ret = {
            pipes: [],
            fittings: []
        };
        var merged, mergePoint;
        if (pipe1.start.distanceToLine(pipe2) <= this.config.overlap.bindDistance) {
            var normPipe = pipe2.toOrigin().normalize();
            var projPipe = pipe2.toOrigin().projection(pipe1.end.sub(pipe2.start));
            mergePoint = normPipe.multiply(projPipe);
            var newP1 = new pipe_model_1.default(new vect_1.Vector(0, 0).sum(pipe2.start), new vect_1.Vector(mergePoint.x, mergePoint.y).sum(pipe2.start));
            var newP2 = new pipe_model_1.default(new vect_1.Vector(mergePoint.x, mergePoint.y).sum(pipe2.start), new vect_1.Vector(pipe2.end.x, pipe2.end.y).sum(pipe2.start));
            ret.pipes.push(newP1);
            ret.pipes.push(newP2);
            mergePoint = mergePoint.sum(pipe2.start);
            merged = true;
        } else if (pipe1.end.distanceToLine(pipe2) <= this.config.overlap.bindDistance) {
            var normPipe = pipe2.toOrigin().normalize();
            var projPipe = pipe2.toOrigin().projection(pipe1.end.sub(pipe2.start));
            mergePoint = normPipe.multiply(projPipe);
            var newP1 = new pipe_model_1.default(new vect_1.Vector(0, 0).sum(pipe2.start), new vect_1.Vector(mergePoint.x, mergePoint.y).sum(pipe2.start));
            var newP2 = new pipe_model_1.default(new vect_1.Vector(mergePoint.x, mergePoint.y).sum(pipe2.start), new vect_1.Vector(pipe2.end.x, pipe2.end.y));
            ret.pipes.push(newP1);
            ret.pipes.push(newP2);
            mergePoint = mergePoint.sum(pipe2.start);
            merged = true;
        }
        if (merged && mergePoint) {
            var newFitting = new fitting_model_1.default(mergePoint);
            ret.fittings.push(newFitting);
        }
        return ret;
    };
    Canvas.prototype.deletePipe = function (id) {
        this.pipes = this.pipes.filter(function (p) {
            return p.id !== id;
        });
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":20,"../overlap.model":12,"./heating/fitting.model":9,"./heating/pipe.model":10}],6:[function(require,module,exports){
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
        _this.width = 1;
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
    function Line(start, end) {
        var _this = _super.call(this) || this;
        _this.thickness = 1;
        _this._color = "#000";
        _this.width = 1;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    Object.defineProperty(Line.prototype, "color", {
        // getNearest(pipes: Array<Pipe>) {
        //   let pipe = pipes.find((pipe) => {
        //     if (pipe._id === this._id) return;
        //
        //     let start = pipe.start.distanceTo(this.end);
        //     let end = pipe.end.distanceTo(this.end);
        //
        //     return (start && start < 30) || (end && end < 30);
        //   });
        //
        //   return pipe;
        // }
        //
        // getNearestCoordinateOnPipe(coord: IVec, pipe: Pipe) {
        //   let _coord = coord.sub(pipe.start);
        // }
        get: function get() {
            return this._color;
        },
        set: function set(color) {
            this._color = color;
        },
        enumerable: false,
        configurable: true
    });
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
    function Pipe(start, end) {
        var _this = _super.call(this, start, end) || this;
        _this.type = "supply";
        return _this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function get() {
            return this.type === "supply" ? "red" : "blue";
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
    function Fitting(center) {
        var _this = _super.call(this, center) || this;
        _this.pipes = [];
        _this.color = "black";
        return _this;
    }
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
var line_model_1 = __importDefault(require("../geometry/line.model"));
var Pipe = /** @class */function (_super) {
    __extends(Pipe, _super);
    function Pipe(start, end) {
        var _this = _super.call(this, start, end) || this;
        _this.ghost = false;
        _this.type = "supply";
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
        return this.end.sub(this.start);
    };
    return Pipe;
}(line_model_1.default);
exports.default = Pipe;

},{"../geometry/line.model":7}],11:[function(require,module,exports){
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
            if (pipe.start.sub(_this.mouse).length <= bind) {
                _p = {
                    type: "pipe",
                    id: pipe.id,
                    ioVector: new vect_1.Vector(pipe.start.x, pipe.start.y)
                };
            }
            if (!_p && pipe.end.sub(_this.mouse).length <= bind) {
                _p = {
                    type: "pipe",
                    id: pipe.id,
                    ioVector: new vect_1.Vector(pipe.end.x, pipe.end.y)
                };
            }
            if (!_p) {
                var l = _this.mouse.distanceToLine(pipe);
                if (l <= bind) {
                    var normPipe = pipe.toOrigin().normalize();
                    var projPipe = pipe.toOrigin().projection(_this.mouse.sub(pipe.start));
                    _p = {
                        type: "pipe",
                        id: pipe.id,
                        ioVector: normPipe.multiply(projPipe).sum(pipe.start)
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
            var from = _this_1.getWorldCoordinates(wall.start.x, wall.start.y);
            var to = _this_1.getWorldCoordinates(wall.end.x, wall.end.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            console.log("wall.color", wall.color);
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
var Fitting = /** @class */function () {
    function Fitting(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Fitting.prototype.drawFittings = function () {
        var _this = this;
        this.canvas.model.fittings.map(function (fitting) {
            _this.drawFitting(fitting);
        });
    };
    Fitting.prototype.drawFitting = function (fitting) {
        this.ctx.save();
        this.ctx.beginPath();
        var c = this.canvas.getWorldCoordinates(fitting.center.x, fitting.center.y);
        this.ctx.arc(c.x, c.y, fitting.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = fitting.color;
        this.ctx.fill();
        this.ctx.restore();
    };
    Fitting.prototype.draw = function () {
        this.drawFittings();
    };
    return Fitting;
}();
exports.default = Fitting;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Mode = /** @class */function () {
    function Mode(model) {
        this.model = model;
        this.container = document.querySelector("#mode");
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
        var from = this.canvas.getWorldCoordinates(pipe.start.x, pipe.start.y);
        var to = this.canvas.getWorldCoordinates(pipe.end.x, pipe.end.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width;
        this.ctx.stroke();
        this.ctx.restore();
    };
    Pipe.prototype.drawGhost = function (pipe) {
        this.ctx.save();
        this.ctx.beginPath();
        var from = this.canvas.getWorldCoordinates(pipe.start.x, pipe.start.y);
        var to = this.canvas.getWorldCoordinates(pipe.end.x, pipe.end.y);
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.strokeStyle = pipe.color;
        this.ctx.lineWidth = pipe.width;
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
        var lVec = l.end.sub(l.start);
        var vec = this.sub(l.start);
        var angle = vec.angle(lVec);
        var p = lVec.product(vec);
        var p1 = vec.product(vec);
        var param = -1;
        if (p !== 0) param = p1 / p;
        if (param < 0) {
            return vec.length;
        } else if (param > 1) {
            return lVec.sub(vec).length;
        }
        return Math.sin(angle) * vec.length;
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
        return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
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
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
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
