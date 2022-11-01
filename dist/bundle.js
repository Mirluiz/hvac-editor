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
        var worldCoord = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        var _mouse = new vect_1.Vector(worldCoord.x, worldCoord.y);
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
        if (this.model.clicked) {
            if (this.model.offset) {
                this.model.offset.x += e.movementX;
                this.model.offset.y += e.movementY;
            } else {
                this.model.offset = {
                    x: 0,
                    y: 0
                };
            }
        }
        var worldCoord = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        var _mouse = new vect_1.Vector(worldCoord.x, worldCoord.y);
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

},{"../../geometry/vect":21,"../models/canvas.model":5,"../views/canvas.view":13,"../views/stats.view":17,"./pipe.controller":3}],2:[function(require,module,exports){
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
var overlap_model_1 = __importDefault(require("../overlap.model"));
var common_1 = require("../../_test_/common");
var Canvas = /** @class */function () {
    function Canvas() {
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
        (0, common_1.fittingModel)(this);
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
        var _this_1 = this;
        this.pipes.map(function (pipe) {
            _this_1.pipes.map(function (_pipe) {
                if (_pipe.id === pipe.id) return;
                if (_pipe.isClose(pipe.from.vec) || _pipe.isClose(pipe.to.vec)) {
                    pipe.merge(_pipe);
                }
            });
            _this_1.fittings.map(function (fitting) {
                if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
                    pipe.connect(fitting);
                }
                if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
                    pipe.connect(fitting);
                }
            });
        });
    };
    //TODO: apply scale transformation here
    Canvas.prototype.getWorldCoordinates = function (x, y) {
        return new vect_1.Vector((x - this.offset.x) * this.scale.amount, (y - this.offset.y) * this.scale.amount);
    };
    //x: (x + this.model.offset.x) * this.model.scale.amount * this.model.scale.coord.x,
    //       y: (y + this.model.offset.y)  * this.model.scale.amount,
    Canvas.prototype.getLocalCoordinates = function (x, y) {
        var _this = this;
        var scale = function scale(vec) {
            return new vect_1.Vector(vec.x * _this.scale.amount, vec.y * _this.scale.amount);
        };
        var translate = function (vec) {
            return new vect_1.Vector(vec.x + _this.offset.x, vec.y + _this.offset.y);
        }.bind(this);
        var t = new vect_1.Vector(x, y);
        t = scale(t);
        // t = rotation(t); TODO order is scaling rotation translation
        t = translate(t);
        return t;
    };
    Canvas.prototype.deletePipe = function (id) {
        this.pipes = this.pipes.filter(function (p) {
            return p.id !== id;
        });
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../_test_/common":19,"../../geometry/vect":21,"../overlap.model":12}],6:[function(require,module,exports){
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
    Line.prototype.intersectionPoint = function (line) {};
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
        var _this = _super.call(this, {
            target: null,
            vec: from,
            title: "from",
            getPipe: function getPipe() {
                return _this;
            },
            getOpposite: function getOpposite() {
                return _this.to;
            }
        }, {
            target: null,
            vec: to,
            title: "to",
            getPipe: function getPipe() {
                return _this;
            },
            getOpposite: function getOpposite() {
                return _this.from;
            }
        }) || this;
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
            if (fitting.isClose(pipe.from.vec) && !pipe.from.target) {
                pipe.connect(fitting);
            }
            if (fitting.isClose(pipe.to.vec) && !pipe.to.target) {
                pipe.connect(fitting);
            }
        });
    };
    Pipe.prototype.beforeMerge = function (pipe1, pipe2) {
        var _this = this;
        var canMerge = false;
        var mergingVec = null;
        var angleBetween;
        [pipe1.from, pipe1.to, pipe2.from, pipe2.to].map(function (end) {
            if (mergingVec) return;
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            overlaps = overlaps.filter(function (o) {
                return o.id !== end.getPipe().id;
            });
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                if (overlap && overlap.pipeEnd) {
                    angleBetween = overlap.pipeEnd.getOpposite().vec.sub(end.vec).angle(end.getOpposite().vec.sub(end.vec));
                }
            }
        });
        if (angleBetween !== undefined && Math.abs(angleBetween * (180 / Math.PI)) >= 90) {
            canMerge = true;
        } else {
            console.warn("cant merge");
            // alert("Cant merge");
        }
        return canMerge;
    };
    Pipe.prototype.afterMerge = function () {
        console.log("after merge");
    };
    Pipe.prototype.merge = function (pipe) {
        var _this = this;
        var merged = false;
        if (!this.beforeMerge(pipe, this)) return false;
        var run = function run(end) {
            if (_this.id === pipe.id) return;
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            overlaps = overlaps.filter(function (o) {
                return o.id !== end.getPipe().id;
            });
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                if (overlap && overlap.pipeEnd) {
                    if (overlap.pipeEnd.target) return;
                    var newFitting = new fitting_model_1.default(_this.model, overlap.pipeEnd.vec);
                    _this.model.addFitting(newFitting);
                    newFitting.addPipe(pipe);
                    newFitting.addPipe(_this);
                    overlap.pipeEnd.target = newFitting;
                    end.target = newFitting;
                } else if (overlap && overlap.pipe) {
                    var mergePoint = overlap.pipe.vec.bindNet(_this.model.config.net.step);
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
            }
        };
        if (!this.from.target) run(this.from);
        if (!this.to.target) run(this.to);
        this.afterMerge();
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

},{"../../../geometry/vect":21,"../geometry/line.model":7,"./fitting.model":9}],11:[function(require,module,exports){
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

},{"../../utils":23}],12:[function(require,module,exports){
"use strict";

var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        this.list = __spreadArray([], this.pipeOverlap(this.mouse), true);
        this.updateList();
        // this.updateNetBoundList();
    };
    Overlap.prototype.wallsOverlap = function () {
        this.model.walls.map(function () {});
    };
    Overlap.prototype.pipeOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.pipes.map(function (pipe) {
            var _p = null;
            if (pipe.from.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    pipeEnd: pipe.from
                };
            }
            if (!_p && pipe.to.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    pipeEnd: pipe.to
                };
            }
            if (!_p) {
                var l = vec.distanceToLine(pipe);
                if (l <= bind) {
                    var normPipe = pipe.toOrigin().normalize();
                    var projPipe = pipe.toOrigin().projection(vec.sub(pipe.from.vec));
                    _p = {
                        id: pipe.id,
                        pipe: {
                            object: pipe,
                            vec: normPipe.multiply(projPipe).sum(pipe.from.vec)
                        }
                    };
                }
            }
            if (_p) ret.push(_p);
        });
        return ret;
    };
    Overlap.prototype.updateList = function () {
        var _a;
        this.list = [];
        (_a = this.list).push.apply(_a, this.pipes);
    };
    return Overlap;
}();
exports.default = Overlap;

},{}],13:[function(require,module,exports){
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
            var from = this.model.getLocalCoordinates(step * iV, 0);
            var to = this.model.getLocalCoordinates(step * iV, h);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            iV++;
        }
        //y
        var iH = 0;
        var maxH = h / step;
        while (iH <= maxH) {
            var from = this.model.getLocalCoordinates(0, step * iH);
            var to = this.model.getLocalCoordinates(w, step * iH);
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
        var x_From = this.model.getLocalCoordinates(0, 0);
        var x_To = this.model.getLocalCoordinates(w, 0);
        var y_From = this.model.getLocalCoordinates(0, 0);
        var y_To = this.model.getLocalCoordinates(0, h);
        ctx.moveTo(0, x_From.y);
        ctx.lineTo(w, x_To.y);
        ctx.moveTo(y_From.x, 0);
        ctx.lineTo(y_To.x, h);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawWalls = function () {
        var _this = this;
        var walls = this.model.walls;
        walls === null || walls === void 0 ? void 0 : walls.map(function (wall) {
            if (!_this.container) return;
            var ctx = _this.container.getContext("2d");
            if (!ctx) return;
            ctx.save();
            ctx.beginPath();
            var from = _this.model.getLocalCoordinates(wall.from.vec.x, wall.from.vec.y);
            var to = _this.model.getLocalCoordinates(wall.from.vec.x, wall.from.vec.y);
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.strokeStyle = wall.color;
            ctx.lineWidth = wall.width;
            ctx.stroke();
            ctx.restore();
        });
    };
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

},{"../../geometry/vect":21,"./fitting.view":14,"./pipe.view":16,"./valve.view":18}],14:[function(require,module,exports){
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
                var v1 = pipe1End.vec.sub(pipe1OppositeEnd.vec).normalize().multiply(10);
                var v2 = pipe2End.vec.sub(pipe2OppositeEnd.vec).normalize().multiply(10);
                var pipe1Width = v1.perpendicular();
                var pipe2Width = v2.perpendicular();
                var pipe1NeckTop = pipe1End.vec.sub(v1).sum(pipe1Width);
                var pipe1NeckBottom = pipe1End.vec.sub(v1).sub(pipe1Width);
                var pipe2NeckTop = pipe2End.vec.sub(v2).sub(pipe2Width);
                var pipe2NeckBottom = pipe2End.vec.sub(v2).sum(pipe2Width);
                var topCurve = new vect_1.Vector(-angleBetween.x, -angleBetween.y).multiply(fitting.width).sum(fitting.center);
                var pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
                var pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
                var needBezier = pipe1Angle - pipe2Angle !== 0;
                var points = [pipe1NeckTop, pipe1NeckBottom, pipe2NeckTop, pipe2NeckBottom];
                points = points.sort(function (a, b) {
                    return (a.x - fitting.center.x) * (b.y - fitting.center.y) - (b.x - fitting.center.x) * (a.y - fitting.center.y);
                });
                var p0 = this.canvas.model.getLocalCoordinates(points[0].x, points[0].y);
                var p1 = this.canvas.model.getLocalCoordinates(points[1].x, points[1].y);
                var p2 = this.canvas.model.getLocalCoordinates(points[2].x, points[2].y);
                var p3 = this.canvas.model.getLocalCoordinates(points[3].x, points[3].y);
                var curve = this.canvas.model.getLocalCoordinates(topCurve.x, topCurve.y);
                this.ctx.moveTo(p0.x, p0.y);
                this.ctx.lineTo(p1.x, p1.y);
                this.ctx.lineTo(p2.x, p2.y);
                this.ctx.lineTo(p3.x, p3.y);
                if (needBezier) {
                    this.ctx.bezierCurveTo(curve.x, curve.y, curve.x, curve.y, p0.x, p0.y);
                }
                this.ctx.closePath();
                this.ctx.stroke();
                this.ctx.fillStyle = "black";
                this.ctx.fill();
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
        this.ctx.restore();
    };
    Fitting.prototype.draw = function () {
        this.drawFittings();
    };
    return Fitting;
}();
exports.default = Fitting;

},{"../../geometry/vect":21}],15:[function(require,module,exports){
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
        var from = this.canvas.model.getLocalCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.model.getLocalCoordinates(pipe.to.vec.x, pipe.to.vec.y);
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
        var from = this.canvas.model.getLocalCoordinates(pipe.from.vec.x, pipe.from.vec.y);
        var to = this.canvas.model.getLocalCoordinates(pipe.to.vec.x, pipe.to.vec.y);
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
        var c = this.canvas.model.getLocalCoordinates(coordinate.x, coordinate.y);
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
        var c = this.canvas.model.getLocalCoordinates(valve.center.x, valve.center.y);
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

var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fittingModel = void 0;
var pipe_model_1 = __importDefault(require("../2d/models/heating/pipe.model"));
var vect_1 = require("../geometry/vect");
var fittingModel = function fittingModel(model) {
    var pipes = model.pipes;
    var step = model.config.net.step / 2;
    // _2Pipes(model, pipes, step);
    _3Pipes(model, pipes, step);
};
exports.fittingModel = fittingModel;
var _2Pipes = function _2Pipes(model, pipes, step) {
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
    [{
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4
    }, {
        x1: 10,
        y1: 4,
        x2: 10,
        y2: 10
    }],
    /*
      1 - from right to left
      2 - from top to bottom
     */
    [{
        x1: 10,
        y1: 4,
        x2: 4,
        y2: 4
    }, {
        x1: 10,
        y1: 4,
        x2: 10,
        y2: 10
    }],
    /*
      1 - from left to right
      2 - from bottom to top
     */
    [{
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4
    }, {
        x1: 10,
        y1: 10,
        x2: 10,
        y2: 4
    }],
    /*
      1 - from right to left
      2 - from bottom to top
     */
    [{
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4
    }, {
        x1: 10,
        y1: 10,
        x2: 10,
        y2: 4
    }]];
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
    [{
        x1: 10,
        y1: 4,
        x2: 4,
        y2: 4
    }, {
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 10
    }],
    /*
      1 - from left top to right
      2 - from top to bottom
     */
    [{
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4
    }, {
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 10
    }],
    /*
      1 - from right to left
      2 - from bottom to top
     */
    [{
        x1: 10,
        y1: 4,
        x2: 4,
        y2: 4
    }, {
        x1: 4,
        y1: 10,
        x2: 4,
        y2: 4
    }],
    /*
      1 - from left to right
      2 - from bottom to top
     */
    [{
        x1: 4,
        y1: 4,
        x2: 10,
        y2: 4
    }, {
        x1: 4,
        y1: 10,
        x2: 4,
        y2: 4
    }]];
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
    [{
        x1: 4,
        y1: 6,
        x2: 8,
        y2: 2
    }, {
        x1: 8,
        y1: 2,
        x2: 12,
        y2: 6
    }],
    /*
      1 - from right to left,
      2 - from left to right,
     */
    [{
        x1: 8,
        y1: 2,
        x2: 4,
        y2: 6
    }, {
        x1: 8,
        y1: 2,
        x2: 12,
        y2: 6
    }],
    /*
     1 - from left to right,
     2 - from right to left,
    */
    [{
        x1: 4,
        y1: 6,
        x2: 8,
        y2: 2
    }, {
        x1: 12,
        y1: 6,
        x2: 8,
        y2: 2
    }],
    /*
     1 - from right to left,
     2 - from right to left,
    */
    [{
        x1: 8,
        y1: 2,
        x2: 4,
        y2: 6
    }, {
        x1: 12,
        y1: 6,
        x2: 8,
        y2: 2
    }]];
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
    [{
        x1: 4,
        y1: 2,
        x2: 8,
        y2: 6
    }, {
        x1: 8,
        y1: 6,
        x2: 12,
        y2: 2
    }],
    /*
      1 - from right to left,
      2 - from left to right,
     */
    [{
        x1: 8,
        y1: 6,
        x2: 4,
        y2: 2
    }, {
        x1: 8,
        y1: 6,
        x2: 12,
        y2: 2
    }],
    /*
     1 - from left to right,
     2 - from right to left,
    */
    [{
        x1: 4,
        y1: 2,
        x2: 8,
        y2: 6
    }, {
        x1: 12,
        y1: 2,
        x2: 8,
        y2: 6
    }],
    /*
     1 - from right to left,
     2 - from right to left,
    */
    [{
        x1: 8,
        y1: 6,
        x2: 4,
        y2: 2
    }, {
        x1: 12,
        y1: 2,
        x2: 8,
        y2: 6
    }]];
    /**
     * Horizontal same angle
     *  --------- * ----------
     */
    var arrays90H = [
    /*
      1 - from left to right
      2 - from left to right,
     */
    [{
        x1: 4,
        y1: 4,
        x2: 8,
        y2: 4
    }, {
        x1: 8,
        y1: 4,
        x2: 12,
        y2: 4
    }],
    /*
      1 - from right to left
      2 - from left to right,
     */
    [{
        x1: 8,
        y1: 4,
        x2: 4,
        y2: 4
    }, {
        x1: 8,
        y1: 4,
        x2: 12,
        y2: 4
    }],
    /*
      1 - from left to right
      2 - from right to left,
     */
    [{
        x1: 4,
        y1: 4,
        x2: 8,
        y2: 4
    }, {
        x1: 12,
        y1: 4,
        x2: 8,
        y2: 4
    }],
    /*
      1 - from right to left
      2 - from right to left,
     */
    [{
        x1: 8,
        y1: 4,
        x2: 4,
        y2: 4
    }, {
        x1: 12,
        y1: 4,
        x2: 8,
        y2: 4
    }]];
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
    [{
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 8
    }, {
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 12
    }],
    /*
      1 - from bottom to top
      2 - from top to bottom
     */
    [{
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 4
    }, {
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 12
    }],
    /*
      1 - from top to bottom
      2 - from bottom to top
     */
    [{
        x1: 4,
        y1: 4,
        x2: 4,
        y2: 8
    }, {
        x1: 4,
        y1: 12,
        x2: 4,
        y2: 8
    }],
    /*
      1 - from bottom to top
      2 - from bottom to top
     */
    [{
        x1: 4,
        y1: 8,
        x2: 4,
        y2: 4
    }, {
        x1: 4,
        y1: 12,
        x2: 4,
        y2: 8
    }]];
    __spreadArray(__spreadArray([], arraysRL90, true), arraysLR90, true).map(function (lines, index) {
        lines.map(function (line) {
            pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + line.x1 * step, line.y1 * step), new vect_1.Vector(100 * index + line.x2 * step, line.y2 * step)));
        });
    });
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
var _3Pipes = function _3Pipes(model, pipes, step) {
    [0].map(function (a, index) {
        var pV1 = new vect_1.Vector(4, 4);
        var pV2 = new vect_1.Vector(8, 4);
        var v1 = new vect_1.Vector(8, 4);
        var v2 = new vect_1.Vector(12, 4).rotate(a, v1);
        var v3 = new vect_1.Vector(12, 4).rotate(a + 90, v1);
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + pV1.x * step, 2 * step + pV1.y * step), new vect_1.Vector(100 * index + pV2.x * step, 2 * step + pV2.y * step)));
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + v1.x * step, 2 * step + v1.y * step), new vect_1.Vector(100 * index + v2.x * step, 2 * step + v2.y * step)));
        pipes.push(new pipe_model_1.default(model, new vect_1.Vector(100 * index + v1.x * step, 2 * step + v1.y * step), new vect_1.Vector(100 * index + v3.x * step, 2 * step + v3.y * step)));
    });
};

},{"../2d/models/heating/pipe.model":10,"../geometry/vect":21}],20:[function(require,module,exports){
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

},{"./2d":4}],21:[function(require,module,exports){
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
    Vector.prototype.rotate = function (angle, around) {
        if (around === void 0) {
            around = undefined;
        }
        var _a = this,
            x = _a.x,
            y = _a.y;
        angle *= Math.PI / 180;
        if (around) {
            x = this.x - around.x;
            y = this.y - around.y;
        }
        var v = new Vector(x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle));
        if (around) {
            v = v.sum(around);
        }
        return v;
    };
    return Vector;
}();
exports.Vector = Vector;

},{}],22:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var app = new app_1.default();
app.run();

},{"./app":20}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.getProperty = exports.uuid = void 0;
var uuid = function uuid() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == "x" ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
};
exports.uuid = uuid;
/**
 * https://mariusschulz.com/blog/keyof-and-lookup-types-in-typescript
 * @param obj
 * @param key
 */
function getProperty(obj, key) {
    return key in obj ? obj : null;
}
exports.getProperty = getProperty;

},{}]},{},[22])

//# sourceMappingURL=bundle.js.map
