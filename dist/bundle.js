(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var stats_view_1 = __importDefault(require("../views/stats.view"));
var pipe_controller_1 = __importDefault(require("./pipe.controller"));
var object_controller_1 = __importDefault(require("./object.controller"));
var Canvas = /** @class */function () {
    function Canvas() {
        this.model = new canvas_model_1.default();
        this.view = new canvas_view_1.default(this.model);
        this.stats = new stats_view_1.default(this.model);
        this.pipe = new pipe_controller_1.default(this.model);
        this.object = new object_controller_1.default(this.model);
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
        if (e.button === 1) {
            this.model.wheelClicked = true;
            return;
        } else {
            this.model.wheelClicked = false;
            this.model.clicked = true;
        }
        if (!this.model.mouse) return;
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseDown();
                break;
            case "radiator":
            case "valve":
                this.object.mouseDown();
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
        if (this.model.wheelClicked || this.model.mode === "default" && this.model.clicked) {
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
        this.model.overlap.update();
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseMove();
                break;
            case "radiator":
            case "valve":
                this.object.mouseMove();
                break;
        }
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseUp = function (e) {
        this.model.clicked = false;
        this.model.wheelClicked = false;
        if (!this.model.mouse) return;
        switch (this.model.mode) {
            case "default":
                break;
            case "wall":
                break;
            case "pipe":
                this.pipe.mouseUp();
                break;
            case "valve":
                this.object.mouseUp();
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
        document.body.style.cursor = "default";
        this.stats.render();
        this.view.draw();
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../models/canvas.model":6,"../views/canvas.view":18,"../views/stats.view":22,"./object.controller":2,"./pipe.controller":3}],2:[function(require,module,exports){
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
var vect_1 = require("../../geometry/vect");
var valve_model_1 = __importDefault(require("../models/ghost/heating/valve.model"));
var valve_model_2 = __importDefault(require("../models/heating/valve.model"));
var radiator_model_1 = __importDefault(require("../models/ghost/heating/radiator.model"));
var radiator_model_2 = __importDefault(require("../models/heating/radiator.model"));
var Pipe = /** @class */function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function () {
        if (!this.model.overlap.boundMouse) return;
        var bV = new vect_1.Vector(this.model.overlap.boundMouse.x, this.model.overlap.boundMouse.y);
        if (this.model.placingObject && this.model.placingObject instanceof valve_model_1.default) {
            if (!this.model.overlap.isEmpty) {
                document.body.style.cursor = "default";
                var pipeFound = __spreadArray(__spreadArray([], this.model.overlap.list, true), this.model.overlap.boundList, true).find(function (o) {
                    return o.body;
                });
                if (pipeFound === null || pipeFound === void 0 ? void 0 : pipeFound.body) {} else {
                    document.body.style.cursor = "not-allowed";
                }
            } else {
                document.body.style.cursor = "not-allowed";
            }
            this.model.placingObject.center.x = bV.x;
            this.model.placingObject.center.y = bV.y;
        }
        if (this.model.placingObject && this.model.placingObject instanceof radiator_model_1.default) {
            this.model.placingObject.center.x = bV.x;
            this.model.placingObject.center.y = bV.y;
        }
    };
    Pipe.prototype.mouseDown = function () {
        if (this.model.placingObject instanceof valve_model_1.default) {
            if (!this.model.placingObject.validation()) {
                console.log("Validation error");
                return;
            }
            var valve = new valve_model_2.default(this.model, this.model.placingObject.center.clone());
            valve.merge();
        }
        if (this.model.placingObject instanceof radiator_model_1.default) {
            if (!this.model.placingObject.validation()) {
                console.log("Validation error");
                return;
            }
            var radiator = new radiator_model_2.default(this.model, this.model.placingObject.center.clone());
            radiator.merge();
            this.model.addRadiator(radiator);
        }
    };
    Pipe.prototype.mouseUp = function () {};
    return Pipe;
}();
exports.default = Pipe;

},{"../../geometry/vect":25,"../models/ghost/heating/radiator.model":10,"../models/ghost/heating/valve.model":11,"../models/heating/radiator.model":14,"../models/heating/valve.model":15}],3:[function(require,module,exports){
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
var vect_1 = require("../../geometry/vect");
var pipe_model_1 = __importDefault(require("../models/ghost/heating/pipe.model"));
var pipe_model_2 = __importDefault(require("../models/heating/pipe.model"));
var fitting_model_1 = __importDefault(require("../models/heating/fitting.model"));
var Pipe = /** @class */function () {
    function Pipe(model) {
        this.model = model;
    }
    Pipe.prototype.mouseMove = function () {
        var _a, _b;
        if (!this.model.overlap.boundMouse) return;
        var bV = new vect_1.Vector(this.model.overlap.boundMouse.x, this.model.overlap.boundMouse.y);
        if (this.model.actionObject && this.model.actionObject instanceof pipe_model_1.default) {
            var target = null;
            for (var _i = 0, _c = __spreadArray(__spreadArray([], this.model.overlap.list, true), this.model.overlap.boundList, true); _i < _c.length; _i++) {
                var overlap = _c[_i];
                if (overlap.io) {
                    target = {
                        id: overlap.id,
                        io: overlap.io,
                        object: overlap.io.getRadiator()
                    };
                } else if (overlap.fitting) {
                    target = {
                        id: overlap.id,
                        object: overlap.fitting
                    };
                } else if (overlap.end) {
                    target = {
                        id: overlap.id,
                        end: overlap.end
                    };
                } else if ((_a = overlap.body) === null || _a === void 0 ? void 0 : _a.object) {
                    target = {
                        id: overlap.id,
                        body: overlap.body
                    };
                }
            }
            if (target === null || target === void 0 ? void 0 : target.io) {
                this.model.actionObject.to.target = target;
                this.model.actionObject.to.vec.x = target.io.getVecAbs().x;
                this.model.actionObject.to.vec.y = target.io.getVecAbs().y;
            } else if ((target === null || target === void 0 ? void 0 : target.object) instanceof fitting_model_1.default) {
                this.model.actionObject.to.target = target;
                this.model.actionObject.to.vec.x = target.object.center.x;
                this.model.actionObject.to.vec.y = target.object.center.y;
            } else if (((_b = target === null || target === void 0 ? void 0 : target.body) === null || _b === void 0 ? void 0 : _b.object) instanceof pipe_model_2.default) {
                this.model.actionObject.to.target = target;
                this.model.actionObject.to.vec.x = target.body.vec.x;
                this.model.actionObject.to.vec.y = target.body.vec.y;
            } else {
                this.model.actionObject.to.target = null;
                this.model.actionObject.to.vec.x = bV.x;
                this.model.actionObject.to.vec.y = bV.y;
            }
            if (!this.model.actionObject.validation()) {
                document.body.style.cursor = "not-allowed";
            } else {
                document.body.style.cursor = "default";
            }
        }
    };
    Pipe.prototype.mouseDown = function () {
        var _a;
        var coord = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        coord = coord.bindNet(this.model.config.net.step);
        if (!this.model.actionObject) {
            this.model.actionMode = "pipeLaying";
        }
        if (this.model.actionObject instanceof pipe_model_1.default) {
            var pipe = new pipe_model_2.default(this.model, this.model.actionObject.from.vec.clone(), this.model.actionObject.to.vec.clone());
            if (!this.model.actionObject.validation()) return;
            pipe.type = (_a = this.model.subMode) !== null && _a !== void 0 ? _a : "supply";
            if (!pipe.validation()) throw new Error("Cant merge");
            pipe.update();
            this.model.addPipe(pipe);
        }
        this.model.actionObject = new pipe_model_1.default(this.model, coord.clone(), coord.clone());
    };
    Pipe.prototype.mouseUp = function () {};
    return Pipe;
}();
exports.default = Pipe;

},{"../../geometry/vect":25,"../models/ghost/heating/pipe.model":9,"../models/heating/fitting.model":12,"../models/heating/pipe.model":13}],4:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_controller_1 = __importDefault(require("./controllers/canvas.controller"));
var toolbar_controller_1 = __importDefault(require("../ui/controller/toolbar.controller"));
var info_panel_controller_1 = __importDefault(require("../ui/controller/info-panel.controller"));
var Controller = /** @class */function () {
    function Controller() {
        this.canvas = new canvas_controller_1.default();
        this.toolbar = new toolbar_controller_1.default(this.canvas.model);
        this.infoPanel = new info_panel_controller_1.default(this.canvas.model);
        this.canvas.model.update();
    }
    return Controller;
}();
exports.default = Controller;

},{"../ui/controller/info-panel.controller":27,"../ui/controller/toolbar.controller":28,"./controllers/canvas.controller":1}],5:[function(require,module,exports){
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
var Wall = /** @class */function (_super) {
    __extends(Wall, _super);
    function Wall(from, to) {
        return _super.call(this, { vec: from }, { vec: to }) || this;
    }
    Object.defineProperty(Wall.prototype, "color", {
        get: function get() {
            return "grey";
        },
        enumerable: false,
        configurable: true
    });
    return Wall;
}(line_model_1.default);
exports.default = Wall;

},{"../geometry/line.model":8}],6:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var valve_model_1 = __importDefault(require("./ghost/heating/valve.model"));
var overlap_model_1 = __importDefault(require("../overlap.model"));
var radiator_model_1 = __importDefault(require("./ghost/heating/radiator.model"));
var Canvas = /** @class */function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this._fittings = [];
        this._radiators = [];
        this.mode = "default";
        this.subMode = null;
        this.actionMode = null;
        this.actionObject = null;
        this.placingObject = null;
        this.mouse = { x: 0, y: 0 };
        this.boundMouse = { x: 0, y: 0 }; // bound for net, or for overlapped objects
        this.canvasSize = null;
        this.mouseCanvasRatio = null;
        this.scale = {
            amount: 1,
            coord: null,
            limitReached: false
        };
        this.clicked = false;
        this.wheelClicked = false;
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
        // fittingModel(this);
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
    Object.defineProperty(Canvas.prototype, "radiators", {
        get: function get() {
            return this._radiators;
        },
        set: function set(value) {
            this._radiators = value;
        },
        enumerable: false,
        configurable: true
    });
    Canvas.prototype.addRadiator = function (radiator) {
        this.radiators.push(radiator);
        this.radiators = this.radiators;
        return this.radiators[this.radiators.length - 1];
    };
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
    Canvas.prototype.addValve = function (valve) {
        this.valves.push(valve);
        this.valves = this.valves;
        return this.fittings[this.valves.length - 1];
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
    Canvas.prototype.updateMode = function (mode) {
        this.mode = mode;
        if (!this.mouse) return;
        this.placingObject = null;
        this.actionObject = null;
        if (mode === "valve") {
            this.placingObject = new valve_model_1.default(this, new vect_1.Vector(this.mouse.x, this.mouse.y));
        }
        if (mode === "radiator") {
            console.log("-", mode);
            this.placingObject = new radiator_model_1.default(this, new vect_1.Vector(this.mouse.x, this.mouse.y));
        }
    };
    Canvas.prototype.updateSubMode = function (subMode) {
        this.subMode = subMode;
    };
    Canvas.prototype.deletePipe = function (id) {
        this.pipes = this.pipes.filter(function (p) {
            return p.id !== id;
        });
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":25,"../overlap.model":17,"./ghost/heating/radiator.model":10,"./ghost/heating/valve.model":11}],7:[function(require,module,exports){
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

},{"../main.model":16}],8:[function(require,module,exports){
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

},{"../main.model":16}],9:[function(require,module,exports){
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
var fitting_model_1 = __importDefault(require("../../heating/fitting.model"));
var Pipe = /** @class */function (_super) {
    __extends(Pipe, _super);
    function Pipe(model, from, to) {
        var _this = _super.call(this, {
            target: null,
            vec: from,
            getPipe: function getPipe() {
                return _this;
            },
            getOpposite: function getOpposite() {
                return _this.to;
            }
        }, {
            target: null,
            vec: to,
            getPipe: function getPipe() {
                return _this;
            },
            getOpposite: function getOpposite() {
                return _this.from;
            }
        }) || this;
        _this.model = model;
        _this.z = 10;
        return _this;
    }
    Object.defineProperty(Pipe.prototype, "color", {
        get: function get() {
            return "pink";
        },
        enumerable: false,
        configurable: true
    });
    Pipe.prototype.validation = function () {
        var _this = this;
        var can = true;
        [this.from, this.to].map(function (end) {
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                var angleBetween = void 0;
                if (overlap && overlap.end) {
                    angleBetween = overlap.end.getOpposite().vec.sub(end.vec).angle(end.getOpposite().vec.sub(end.vec));
                    if (angleBetween !== undefined && Math.abs(angleBetween * (180 / Math.PI)) < 90) {
                        can = false;
                    }
                } else if (overlap && overlap.body) {
                    can = true;
                } else {
                    can = false;
                }
            }
        });
        if (!can) {
            return can;
        }
        [this.from, this.to].map(function (end) {
            var overlaps = _this.model.overlap.direct(end.vec);
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                if (overlap && overlap.end) {
                    if (overlap.end.target && !(overlap.end.target.object instanceof fitting_model_1.default)) {
                        can = false;
                        console.warn("Target is not empty");
                    }
                }
                if (overlap && overlap.io) {
                    if (overlap.io.isConnected()) {
                        can = false;
                        console.warn("Already is connected");
                    }
                }
            }
        });
        if (!can) {
            console.warn("Cant merge");
        }
        return can;
    };
    return Pipe;
}(line_model_1.default);
exports.default = Pipe;

},{"../../geometry/line.model":8,"../../heating/fitting.model":12}],10:[function(require,module,exports){
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
var vect_1 = require("../../../../geometry/vect");
var main_model_1 = __importDefault(require("../../main.model"));
var Radiator = /** @class */function (_super) {
    __extends(Radiator, _super);
    function Radiator(model, center) {
        var _this = _super.call(this) || this;
        _this.width = 80;
        _this.height = 40;
        _this.IOs = [{
            type: "return",
            getVecAbs: function getVecAbs() {
                var v = new vect_1.Vector(-10, 0);
                return v.sum(_this.center);
            },
            getRadiator: function getRadiator() {
                return _this;
            },
            vec: new vect_1.Vector(-10, 0),
            isConnected: function isConnected() {
                return false;
            }
        }, {
            type: "supply",
            getVecAbs: function getVecAbs() {
                var v = new vect_1.Vector(-10, 40);
                return v.sum(_this.center);
            },
            getRadiator: function getRadiator() {
                return _this;
            },
            vec: new vect_1.Vector(-10, 40),
            isConnected: function isConnected() {
                return false;
            }
        }];
        _this.center = center;
        _this.model = model;
        return _this;
    }
    Radiator.prototype.validation = function () {
        return true;
    };
    return Radiator;
}(main_model_1.default);
exports.default = Radiator;

},{"../../../../geometry/vect":25,"../../main.model":16}],11:[function(require,module,exports){
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
var arc_model_1 = __importDefault(require("../../geometry/arc.model"));
var Valve = /** @class */function (_super) {
    __extends(Valve, _super);
    function Valve(model, center) {
        var _this = _super.call(this, center) || this;
        _this._pipes = [];
        _this.width = 10;
        _this.length = 20;
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Valve.prototype, "pipes", {
        get: function get() {
            return this._pipes;
        },
        set: function set(value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Valve.prototype.validation = function () {
        var overlaps = this.model.overlap.pipeOverlap(this.center);
        return overlaps.length > 0 && Boolean(overlaps.find(function (o) {
            return o.body;
        }));
    };
    return Valve;
}(arc_model_1.default);
exports.default = Valve;

},{"../../geometry/arc.model":7}],12:[function(require,module,exports){
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
        _this.neck = 10;
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

},{"../geometry/arc.model":7}],13:[function(require,module,exports){
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
    Pipe.prototype.update = function () {
        var _this = this;
        this.model.pipes.map(function (_pipe) {
            if (_pipe.id === _this.id) return;
            if (_pipe.isClose(_this.from.vec) || _pipe.isClose(_this.to.vec)) {
                _this.merge(_pipe);
            }
        });
        this.model.fittings.map(function (fitting) {
            if (fitting.isClose(_this.from.vec) && !_this.from.target) {
                _this.connect(fitting);
            }
            if (fitting.isClose(_this.to.vec) && !_this.to.target) {
                _this.connect(fitting);
            }
        });
        this.model.radiators.map(function (radiator) {
            var io = radiator.isClose(_this.to.vec);
            if (io) {
                _this.connect(io);
            }
        });
    };
    Pipe.prototype.validation = function () {
        var _this = this;
        var can = true;
        [this.from, this.to].map(function (end) {
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            overlaps = overlaps.filter(function (o) {
                return o.id !== _this.id;
            });
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                var angleBetween = void 0;
                if (overlap && overlap.end) {
                    angleBetween = overlap.end.getOpposite().vec.sub(end.vec).angle(end.getOpposite().vec.sub(end.vec));
                    if (angleBetween !== undefined && Math.abs(angleBetween * (180 / Math.PI)) < 90) {
                        can = false;
                    }
                } else if (overlap && overlap.body) {
                    can = true;
                } else {
                    can = false;
                }
            }
        });
        if (!can) {
            console.warn("Cant merge");
        }
        return can;
    };
    Pipe.prototype.beforeMerge = function () {
        console.log("before merge");
        return this.validation();
    };
    Pipe.prototype.afterMerge = function () {
        console.log("after merge");
    };
    Pipe.prototype.merge = function (pipe) {
        var _this = this;
        var merged = false;
        if (!this.beforeMerge()) return false;
        var run = function run(end) {
            if (_this.id === pipe.id) return;
            var overlaps = _this.model.overlap.pipeOverlap(end.vec);
            overlaps = overlaps.filter(function (o) {
                return o.id !== end.getPipe().id;
            });
            if (overlaps.length > 0) {
                var overlap = overlaps[0];
                if (overlap && overlap.end) {
                    if (overlap.end.target) return;
                    var newFitting = new fitting_model_1.default(_this.model, overlap.end.vec);
                    _this.model.addFitting(newFitting);
                    newFitting.addPipe(overlap.end.getPipe());
                    newFitting.addPipe(end.getPipe());
                    overlap.end.target = { id: newFitting.id, object: newFitting };
                    end.target = { id: newFitting.id, object: newFitting };
                } else if (overlap && overlap.body) {
                    var mergePoint = overlap.body.vec.bindNet(_this.model.config.net.step);
                    var newP1 = new Pipe(_this.model, overlap.body.object.from.vec.clone(), new vect_1.Vector(mergePoint.x, mergePoint.y));
                    var newP2 = new Pipe(_this.model, new vect_1.Vector(mergePoint.x, mergePoint.y), overlap.body.object.to.vec.clone());
                    _this.model.addPipe(newP1);
                    _this.model.addPipe(newP2);
                    overlap.body.object.delete();
                    var newFitting = new fitting_model_1.default(_this.model, mergePoint);
                    _this.model.addFitting(newFitting);
                    newFitting.addPipe(newP1);
                    newFitting.addPipe(newP2);
                    newP1.from.target = pipe.from.target;
                    newP1.to.target = { id: newFitting.id, object: newFitting };
                    newP2.from.target = { id: newFitting.id, object: newFitting };
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
                this.from.target = { id: target.id, object: target };
            } else if (isTo) this.to.target = { id: target.id, object: target };
            return merged;
        }
        if (target && "getRadiator" in target) {
            var isFrom = target.getVecAbs().sub(this.from.vec).length <= 20;
            var isTo = target.getVecAbs().sub(this.to.vec).length <= 20;
            if (isFrom || isTo) {
                merged = true;
            }
            if (isFrom) {
                this.from.target = {
                    id: target.getRadiator().id,
                    object: target.getRadiator(),
                    io: target
                };
            } else if (isTo) this.to.target = {
                id: target.getRadiator().id,
                object: target.getRadiator(),
                io: target
            };
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

},{"../../../geometry/vect":25,"../geometry/line.model":8,"./fitting.model":12}],14:[function(require,module,exports){
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
var main_model_1 = __importDefault(require("../main.model"));
var Radiator = /** @class */function (_super) {
    __extends(Radiator, _super);
    function Radiator(model, center) {
        var _this = _super.call(this) || this;
        _this.width = 80;
        _this.height = 40;
        _this.IOs = [{
            type: "return",
            getVecAbs: function getVecAbs() {
                var v = new vect_1.Vector(-10, 0);
                return v.sum(_this.objectCenter).sum(_this.center);
            },
            getRadiator: function getRadiator() {
                return _this;
            },
            vec: new vect_1.Vector(-10, 0),
            isConnected: function isConnected() {
                var ret = _this.model.pipes.find(function (p) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ((_b = (_a = p.from.target) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.id) === _this.id && ((_d = (_c = p.from.target) === null || _c === void 0 ? void 0 : _c.io) === null || _d === void 0 ? void 0 : _d.type) === "return" || ((_f = (_e = p.to.target) === null || _e === void 0 ? void 0 : _e.object) === null || _f === void 0 ? void 0 : _f.id) === _this.id && ((_h = (_g = p.to.target) === null || _g === void 0 ? void 0 : _g.io) === null || _h === void 0 ? void 0 : _h.type) === "return";
                });
                return Boolean(ret);
            }
        }, {
            type: "supply",
            getVecAbs: function getVecAbs() {
                var v = new vect_1.Vector(-10, 40);
                return v.sum(_this.objectCenter).sum(_this.center);
            },
            getRadiator: function getRadiator() {
                return _this;
            },
            vec: new vect_1.Vector(-10, 40),
            isConnected: function isConnected() {
                var ret = _this.model.pipes.find(function (p) {
                    var _a, _b, _c, _d, _e, _f, _g, _h;
                    return ((_b = (_a = p.from.target) === null || _a === void 0 ? void 0 : _a.object) === null || _b === void 0 ? void 0 : _b.id) === _this.id && ((_d = (_c = p.from.target) === null || _c === void 0 ? void 0 : _c.io) === null || _d === void 0 ? void 0 : _d.type) === "supply" || ((_f = (_e = p.to.target) === null || _e === void 0 ? void 0 : _e.object) === null || _f === void 0 ? void 0 : _f.id) === _this.id && ((_h = (_g = p.to.target) === null || _g === void 0 ? void 0 : _g.io) === null || _h === void 0 ? void 0 : _h.type) === "supply";
                });
                return Boolean(ret);
            }
        }];
        _this.center = center;
        _this.model = model;
        _this.objectCenter = new vect_1.Vector(_this.width / 2, _this.height / 2).reverse();
        return _this;
    }
    Object.defineProperty(Radiator.prototype, "pipes", {
        get: function get() {
            return [];
        },
        enumerable: false,
        configurable: true
    });
    Radiator.prototype.beforeMerge = function () {
        return true;
    };
    Radiator.prototype.merge = function () {
        var merged = false;
        if (!this.beforeMerge()) return false;
        this.afterMerge();
        return merged;
    };
    Radiator.prototype.afterMerge = function () {};
    Radiator.prototype.isClose = function (v) {
        var distance = this.model.config.overlap.bindDistance;
        var ret = undefined;
        for (var _i = 0, _a = this.IOs; _i < _a.length; _i++) {
            var io = _a[_i];
            if (io.getVecAbs().sub(v).length <= distance) {
                ret = io;
            }
        }
        return ret;
    };
    return Radiator;
}(main_model_1.default);
exports.default = Radiator;

},{"../../../geometry/vect":25,"../main.model":16}],15:[function(require,module,exports){
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
var arc_model_1 = __importDefault(require("../geometry/arc.model"));
var pipe_model_1 = __importDefault(require("./pipe.model"));
var Valve = /** @class */function (_super) {
    __extends(Valve, _super);
    function Valve(model, center) {
        var _this = _super.call(this, center) || this;
        _this._pipes = [];
        _this.width = 10;
        _this.length = 20;
        _this.model = model;
        return _this;
    }
    Object.defineProperty(Valve.prototype, "pipes", {
        get: function get() {
            return this._pipes;
        },
        set: function set(value) {
            this._pipes = value;
        },
        enumerable: false,
        configurable: true
    });
    Valve.prototype.beforeMerge = function () {
        return true;
    };
    Valve.prototype.merge = function () {
        var _this = this;
        var merged = false;
        if (!this.beforeMerge()) return false;
        var overlaps = this.model.overlap.pipeOverlap(this.center);
        overlaps = overlaps.filter(function (o) {
            return o.id !== _this.id;
        });
        overlaps.map(function (overlap) {
            if (overlap.body) {
                var mergePoint = overlap.body.vec.bindNet(_this.model.config.net.step);
                var newP1 = new pipe_model_1.default(_this.model, overlap.body.object.from.vec.clone(), new vect_1.Vector(mergePoint.x, mergePoint.y));
                var newP2 = new pipe_model_1.default(_this.model, new vect_1.Vector(mergePoint.x, mergePoint.y), overlap.body.object.to.vec.clone());
                _this.model.addPipe(newP1);
                _this.model.addPipe(newP2);
                overlap.body.object.delete();
                var newValve = new Valve(_this.model, mergePoint);
                _this.model.addValve(newValve);
                newValve.addPipe(newP1);
                newValve.addPipe(newP2);
                newP1.from.target = overlap.body.object.from.target;
                newP1.to.target = { id: newValve.id, object: newValve };
                newP2.from.target = { id: newValve.id, object: newValve };
                newP2.to.target = overlap.body.object.to.target;
                merged = true;
            }
        });
        this.afterMerge();
        return merged;
    };
    Valve.prototype.afterMerge = function () {};
    Valve.prototype.isClose = function (v) {
        var distance = this.model.config.overlap.bindDistance;
        return this.center.sub(v).length <= distance;
    };
    Valve.prototype.addPipe = function (pipe) {
        this._pipes.push(pipe);
        this.pipes = this._pipes;
        return this.pipes[this.pipes.length - 1];
    };
    return Valve;
}(arc_model_1.default);
exports.default = Valve;

},{"../../../geometry/vect":25,"../geometry/arc.model":7,"./pipe.model":13}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var Main = /** @class */function () {
    function Main() {
        this.z = 0;
        this.id = (0, utils_1.uuid)();
    }
    return Main;
}();
exports.default = Main;

},{"../../utils":31}],17:[function(require,module,exports){
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
var vect_1 = require("../geometry/vect");
var Overlap = /** @class */function () {
    function Overlap(model) {
        this.boundMouse = null;
        this.walls = [];
        this.pipes = [];
        this.valves = [];
        this.objectIOs = [];
        this.list = [];
        this.boundList = [];
        this.model = model;
    }
    Object.defineProperty(Overlap.prototype, "isEmpty", {
        get: function get() {
            return this.list.length === 0 && this.boundList.length === 0;
        },
        enumerable: false,
        configurable: true
    });
    Overlap.prototype.update = function () {
        var wMouse = this.model.getWorldCoordinates(this.model.mouse.x, this.model.mouse.y);
        var netBoundMouse = new vect_1.Vector(Math.round(wMouse.x / this.model.config.net.step) * this.model.config.net.step, Math.round(wMouse.y / this.model.config.net.step) * this.model.config.net.step);
        var v = new vect_1.Vector(wMouse.x, wMouse.y);
        this.wallsOverlap();
        this.list = __spreadArray(__spreadArray([], this.pipeOverlap(v), true), this.IOOverlap(v), true);
        this.boundList = __spreadArray(__spreadArray([], this.pipeOverlap(netBoundMouse), true), this.IOOverlap(netBoundMouse), true);
        if (this.list.length === 0 && this.boundList.length === 0) {
            this.boundMouse = netBoundMouse.clone();
        }
        // else {
        //   let firstElement = [...this.list, ...this.boundList][0];
        //
        //   if (firstElement.pipe) {
        //     this.boundMouse = firstElement.pipe.vec;
        //   } else if (firstElement.io) {
        //     this.boundMouse = firstElement.io.getVecAbs();
        //   } else if (firstElement.fitting) {
        //     this.boundMouse = firstElement.fitting.center;
        //   } else if (firstElement.pipeEnd) {
        //     this.boundMouse = firstElement.pipeEnd.vec;
        //   } else {
        //     this.boundMouse = netBoundMouse.clone();
        //   }
        // }
    };
    Overlap.prototype.direct = function (vec) {
        var list = __spreadArray(__spreadArray([], this.pipeOverlap(vec), true), this.IOOverlap(vec), true);
        return list;
    };
    Overlap.prototype.wallsOverlap = function () {
        this.model.walls.map(function () {});
    };
    //Todo: currently all project use this, split it.
    Overlap.prototype.pipeOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.pipes.map(function (pipe) {
            var _p = null;
            if (pipe.from.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    end: pipe.from
                };
            }
            if (!_p && pipe.to.vec.sub(vec).length <= bind) {
                _p = {
                    id: pipe.id,
                    end: pipe.to
                };
            }
            if (!_p) {
                var l = vec.distanceToLine(pipe);
                if (l <= bind) {
                    var normPipe = pipe.toOrigin().normalize();
                    var projPipe = pipe.toOrigin().projection(vec.sub(pipe.from.vec));
                    _p = {
                        id: pipe.id,
                        body: {
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
    Overlap.prototype.IOOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.radiators.map(function (radiator) {
            radiator.IOs.map(function (io) {
                var _r = null;
                if (io.getVecAbs().sub(vec).length <= bind) {
                    _r = {
                        id: radiator.id,
                        io: io
                    };
                }
                if (_r) ret.push(_r);
            });
        });
        if (ret.length > 1) {
            ret.sort(function (a, b) {
                return 1;
                // return a.io?.vec.x -
            });
        }
        return ret;
    };
    return Overlap;
}();
exports.default = Overlap;

},{"../geometry/vect":25}],18:[function(require,module,exports){
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
var vect_1 = require("../../geometry/vect");
var pipe_view_1 = __importDefault(require("./pipe.view"));
var valve_view_1 = __importDefault(require("./valve.view"));
var fitting_view_1 = __importDefault(require("./fitting.view"));
var radiator_view_1 = __importDefault(require("./radiator.view"));
var pipe_model_1 = __importDefault(require("../models/heating/pipe.model"));
var wall_model_1 = __importDefault(require("../models/architecture/wall.model"));
var radiator_model_1 = __importDefault(require("../models/heating/radiator.model"));
var valve_model_1 = __importDefault(require("../models/heating/valve.model"));
var valve_model_2 = __importDefault(require("../models/ghost/heating/valve.model"));
var fitting_model_1 = __importDefault(require("../models/heating/fitting.model"));
var pipe_model_2 = __importDefault(require("../models/ghost/heating/pipe.model"));
var radiator_model_2 = __importDefault(require("../models/ghost/heating/radiator.model"));
var Canvas = /** @class */function () {
    function Canvas(model) {
        this.pipe = null;
        this.valve = null;
        this.fitting = null;
        this.radiator = null;
        this.zIndex = null;
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
            this.radiator = new radiator_view_1.default(this, this.model, ctx);
            this.zIndex = new radiator_view_1.default(this, this.model, ctx);
        }
    };
    Canvas.prototype.draw = function () {
        var _this = this;
        var _a, _b, _c;
        this.clear();
        this.drawNet();
        this.drawWalls();
        var _d = this.model,
            pipes = _d.pipes,
            walls = _d.walls,
            radiators = _d.radiators,
            valves = _d.valves,
            fittings = _d.fittings;
        var objects = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], pipes, true), walls, true), radiators, true), valves, true), fittings, true).sort(function (a, b) {
            return a.z - b.z;
        });
        objects.map(function (object) {
            var _a, _b, _c, _d;
            if (object instanceof pipe_model_1.default) {
                (_a = _this.pipe) === null || _a === void 0 ? void 0 : _a.drawPipe(object);
            }
            if (object instanceof wall_model_1.default) {
                // console.log("Wall");
                // this.drawWall(o);
            }
            if (object instanceof radiator_model_1.default) {
                // console.log("Radiator");
                (_b = _this.radiator) === null || _b === void 0 ? void 0 : _b.drawRadiator(object);
            }
            if (object instanceof valve_model_1.default) {
                // console.log("Vavle");
                (_c = _this.valve) === null || _c === void 0 ? void 0 : _c.drawValve(object);
            }
            if (object instanceof fitting_model_1.default) {
                (_d = _this.fitting) === null || _d === void 0 ? void 0 : _d.drawFitting(object);
            }
        });
        if (this.model.actionObject && this.model.actionObject instanceof pipe_model_2.default) {
            (_a = this.pipe) === null || _a === void 0 ? void 0 : _a.drawGhost(this.model.actionObject);
        }
        if (this.model.placingObject && this.model.placingObject instanceof valve_model_2.default) {
            (_b = this.valve) === null || _b === void 0 ? void 0 : _b.drawGhost(this.model.placingObject);
        }
        if (this.model.placingObject && this.model.placingObject instanceof radiator_model_2.default) {
            (_c = this.radiator) === null || _c === void 0 ? void 0 : _c.drawGhost(this.model.placingObject);
        }
        // this.pipe?.draw();
        // this.valve?.draw();
        // this.fitting?.draw();
        // this.radiator?.draw();
        // this.zIndex?.draw(); // draw top elements in canvas
    };
    Canvas.prototype.clear = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx || !this.model.mouse || !this.container) return;
        ctx.clearRect(0, 0, this.container.width, this.container.height);
        ctx.fillStyle = "#f5f5f5";
        ctx.fillRect(0, 0, this.container.width, this.container.height);
        //f5f5f5
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
        var h = Math.ceil(screen.height / this.model.config.net.step) * this.model.config.net.step;
        var w = Math.ceil(screen.width / this.model.config.net.step) * this.model.config.net.step - 250; // 250 is panel width
        this.container.style.height = h + "px";
        this.container.style.width = w + "px";
        this.container.height = h;
        this.container.width = w;
        this.model.canvasSize = {
            y: h,
            x: w
        };
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":25,"../models/architecture/wall.model":5,"../models/ghost/heating/pipe.model":9,"../models/ghost/heating/radiator.model":10,"../models/ghost/heating/valve.model":11,"../models/heating/fitting.model":12,"../models/heating/pipe.model":13,"../models/heating/radiator.model":14,"../models/heating/valve.model":15,"./fitting.view":19,"./pipe.view":20,"./radiator.view":21,"./valve.view":23}],19:[function(require,module,exports){
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
        var _this = this;
        var _a, _b, _c, _d, _e;
        this.ctx.save();
        this.ctx.beginPath();
        switch (fitting.type) {
            case "2d":
                {
                    var pipe1 = fitting.pipes[0];
                    var pipe2 = fitting.pipes[1];
                    var pipe1End = void 0,
                        pipe1OppositeEnd = void 0,
                        pipe2End = void 0,
                        pipe2OppositeEnd = void 0;
                    pipe1End = ((_a = pipe1.from.target) === null || _a === void 0 ? void 0 : _a.id) === fitting.id ? pipe1.from : pipe1.to;
                    pipe1OppositeEnd = pipe1End.getOpposite();
                    pipe2End = ((_b = pipe2.from.target) === null || _b === void 0 ? void 0 : _b.id) === fitting.id ? pipe2.from : pipe2.to;
                    pipe2OppositeEnd = pipe2End.getOpposite();
                    if (!pipe1End || !pipe2End || !pipe1OppositeEnd || !pipe2OppositeEnd) break;
                    var fitting1N = pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize();
                    var fitting2N = pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize();
                    // console.log(
                    //   "fitting1N.angle();",
                    //   fitting1N.angle1(fitting2N) * (180 / Math.PI),
                    //   fitting2N.angle1(fitting1N) * (180 / Math.PI)
                    // );
                    var fittingNeck1Left = fitting1N.perpendicular("left").multiply(fitting.neck).sum(fitting1N.multiply(fitting.neck)).sum(fitting.center);
                    var fittingNeck1Right = fitting1N.perpendicular("right").multiply(fitting.neck).sum(fitting1N.multiply(fitting.neck)).sum(fitting.center);
                    var fittingNeck2Left = fitting2N.perpendicular("left").multiply(fitting.neck).sum(fitting2N.multiply(fitting.neck)).sum(fitting.center);
                    var fittingNeck2Right = fitting2N.perpendicular("right").multiply(fitting.neck).sum(fitting2N.multiply(fitting.neck)).sum(fitting.center);
                    var pipe1Angle = pipe1OppositeEnd.vec.sub(pipe1End.vec).angle();
                    var pipe2Angle = pipe2End.vec.sub(pipe2OppositeEnd.vec).angle();
                    var needBezier = pipe1Angle - pipe2Angle !== 0;
                    var p1 = this.canvas.model.getLocalCoordinates(fittingNeck1Right.x, fittingNeck1Right.y);
                    var p2 = this.canvas.model.getLocalCoordinates(fittingNeck1Left.x, fittingNeck1Left.y);
                    var p3 = this.canvas.model.getLocalCoordinates(fittingNeck2Right.x, fittingNeck2Right.y);
                    var p4 = this.canvas.model.getLocalCoordinates(fittingNeck2Left.x, fittingNeck2Left.y);
                    this.ctx.moveTo(p1.x, p1.y);
                    if (needBezier) {
                        var curve = fitting1N.perpendicular("right").sum(fitting2N.perpendicular("left")).normalize().multiply(fitting.neck).sum(fitting.center);
                        var c = this.canvas.model.getLocalCoordinates(curve.x, curve.y);
                        this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p4.x, p4.y);
                    } else {
                        this.ctx.lineTo(p4.x, p4.y);
                    }
                    this.ctx.lineTo(p3.x, p3.y);
                    if (needBezier) {
                        var curve = fitting2N.perpendicular("right").sum(fitting1N.perpendicular("left")).normalize().multiply(fitting.neck).sum(fitting.center);
                        var c = this.canvas.model.getLocalCoordinates(curve.x, curve.y);
                        this.ctx.bezierCurveTo(c.x, c.y, c.x, c.y, p2.x, p2.y);
                    } else {
                        this.ctx.lineTo(p2.x, p2.y);
                    }
                    this.ctx.closePath();
                    this.ctx.stroke();
                    this.ctx.fillStyle = "black";
                    this.ctx.fill();
                }
                break;
            case "3d":
                {
                    var pipe1 = fitting.pipes[0];
                    var pipe2 = fitting.pipes[1];
                    var pipe3 = fitting.pipes[2];
                    var pipe1End = void 0,
                        pipe1OppositeEnd = void 0,
                        pipe2End = void 0,
                        pipe2OppositeEnd = void 0,
                        pipe3End = void 0,
                        pipe3OppositeEnd = void 0;
                    pipe1End = ((_c = pipe1.from.target) === null || _c === void 0 ? void 0 : _c.id) === fitting.id ? pipe1.from : pipe1.to;
                    pipe1OppositeEnd = pipe1End.getOpposite();
                    pipe2End = ((_d = pipe2.from.target) === null || _d === void 0 ? void 0 : _d.id) === fitting.id ? pipe2.from : pipe2.to;
                    pipe2OppositeEnd = pipe2End.getOpposite();
                    pipe3End = ((_e = pipe3.from.target) === null || _e === void 0 ? void 0 : _e.id) === fitting.id ? pipe3.from : pipe3.to;
                    pipe3OppositeEnd = pipe3End.getOpposite();
                    if (!pipe1End || !pipe2End || !pipe3End || !pipe3OppositeEnd || !pipe1OppositeEnd || !pipe2OppositeEnd) break;
                    var necks_1 = [];
                    var fittingNormalized = [pipe1OppositeEnd.vec.sub(pipe1End.vec).normalize(), pipe2OppositeEnd.vec.sub(pipe2End.vec).normalize(), pipe3OppositeEnd.vec.sub(pipe3End.vec).normalize()];
                    fittingNormalized.sort(function (a, b) {
                        return a.angle() - b.angle();
                    });
                    fittingNormalized.map(function (n) {
                        necks_1.push(n.multiply(fitting.neck).sub(n.multiply(fitting.neck).perpendicular("right")).sum(fitting.center), n.multiply(fitting.neck).sub(n.multiply(fitting.neck).perpendicular("left")).sum(fitting.center));
                    });
                    necks_1.map(function (p, index) {
                        var wP = _this.canvas.model.getLocalCoordinates(p.x, p.y);
                        if (index === 0) _this.ctx.moveTo(wP.x, wP.y);
                        _this.ctx.lineTo(wP.x, wP.y);
                    });
                    this.ctx.closePath();
                    this.ctx.stroke();
                    this.ctx.fillStyle = "black";
                    this.ctx.fill();
                }
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

},{}],20:[function(require,module,exports){
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
        var _a, _b;
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
        if ((_a = pipe.from.target) === null || _a === void 0 ? void 0 : _a.io) {
            var _wp = pipe.from.target.io.getVecAbs();
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "red";
            this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#ADD8E6";
            this.ctx.fill();
            this.ctx.restore();
        }
        if ((_b = pipe.to.target) === null || _b === void 0 ? void 0 : _b.io) {
            var _wp = pipe.to.target.io.getVecAbs();
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.strokeStyle = "red";
            this.ctx.arc(_wp.x, _wp.y, 5, 0, 2 * Math.PI);
            this.ctx.fillStyle = "#ADD8E6";
            this.ctx.fill();
            this.ctx.restore();
        }
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
        var _this = this;
        this.canvas.model.overlap.list.map(function (l) {
            var _a;
            if (l) {
                var _p = _this.canvas.model.getPipeByID(l.id);
                if (_p && ((_a = l.body) === null || _a === void 0 ? void 0 : _a.vec)) {
                    _this.drawOverLap(l.body.vec);
                }
            }
        });
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

},{"../models/ghost/heating/pipe.model":9}],21:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var radiator_model_1 = __importDefault(require("../models/ghost/heating/radiator.model"));
var Radiator = /** @class */function () {
    function Radiator(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Radiator.prototype.drawRadiators = function () {
        var _this = this;
        this.canvas.model.radiators.map(function (radiator) {
            _this.drawRadiator(radiator);
        });
    };
    Radiator.prototype.drawRadiator = function (radiator) {
        var _this = this;
        this.ctx.save();
        this.ctx.beginPath();
        var toCenter = radiator.objectCenter.sum(radiator.center);
        var wP = this.canvas.model.getLocalCoordinates(radiator.center.x, radiator.center.y);
        this.ctx.rect(toCenter.x, toCenter.y, radiator.width, radiator.height);
        this.ctx.stroke();
        this.ctx.restore();
        radiator.IOs.map(function (io) {
            var toCenter = io.getVecAbs();
            var wP = _this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);
            _this.ctx.save();
            _this.ctx.beginPath();
            _this.ctx.strokeStyle = "red";
            _this.ctx.arc(wP.x, wP.y, 5, 0, 2 * Math.PI);
            _this.ctx.fillStyle = io.type === "supply" ? "red" : "blue";
            _this.ctx.fill();
            _this.ctx.restore();
        });
    };
    Radiator.prototype.drawGhost = function (radiator) {
        var _this = this;
        this.ctx.save();
        this.ctx.beginPath();
        var toCenter = new vect_1.Vector(-radiator.width / 2, -radiator.height / 2).sum(radiator.center);
        var wP = this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);
        this.ctx.strokeStyle = "red";
        this.ctx.rect(wP.x, wP.y, radiator.width, radiator.height);
        this.ctx.stroke();
        this.ctx.restore();
        radiator.IOs.map(function (io) {
            var toCenter = new vect_1.Vector(-radiator.width / 2, -radiator.height / 2).sum(radiator.center.sum(io.vec));
            var wP = _this.canvas.model.getLocalCoordinates(toCenter.x, toCenter.y);
            // this.ctx.save();
            // this.ctx.beginPath();
            // this.ctx.strokeStyle = "red";
            // this.ctx.arc(wP.x, wP.y, 5, 0, 2 * Math.PI);
            // this.ctx.fillStyle = io.type === "supply" ? "red" : "blue";
            // this.ctx.fill();
            // this.ctx.restore();
        });
    };
    Radiator.prototype.draw = function () {
        this.drawRadiators();
        if (this.canvas.model.placingObject && this.canvas.model.placingObject instanceof radiator_model_1.default) {
            this.drawGhost(this.canvas.model.placingObject);
        }
    };
    return Radiator;
}();
exports.default = Radiator;

},{"../../geometry/vect":25,"../models/ghost/heating/radiator.model":10}],22:[function(require,module,exports){
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
        this.container.innerHTML = "\n      <div style=\"display: flex; flex-direction: column\">\n        <div>x - ".concat(Math.round(this.model.offset.x), " \n        / y - ").concat(Math.round(this.model.offset.y), "</div>\n        \n        <div>x - ").concat(Math.round((_b = (_a = this.model.mouse) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0), " \n        / y - ").concat(Math.round((_d = (_c = this.model.mouse) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0), "</div>\n        \n        <div>scale - ").concat(this.model.scale.amount, "</div>\n        <div>width - ").concat((_e = this.model.canvasSize) === null || _e === void 0 ? void 0 : _e.x, " / height - ").concat((_f = this.model.canvasSize) === null || _f === void 0 ? void 0 : _f.y, " / </div>\n        <div>ratio x ").concat((_g = this.model.mouseCanvasRatio) === null || _g === void 0 ? void 0 : _g.x, " / y ").concat((_h = this.model.mouseCanvasRatio) === null || _h === void 0 ? void 0 : _h.y, "</div>\n        <div>action mode is ").concat(this.model.actionMode, "</div>\n      </div>\n      </div>\n        <div>mode is ").concat(this.model.mode, "</div>\n      </div>\n      \n      </div>\n        <div>fitting size is ").concat(this.model.fittings.length, "</div>\n        <div>pipes size is ").concat(this.model.pipes.length, "</div>\n      </div>\n      </div>\n        <div>hovered object ").concat((_j = this.model.getPipeByID(this.model.overlap.list.length > 0 && this.model.overlap.list[0].id ? this.model.overlap.list[0].id : "")) === null || _j === void 0 ? void 0 : _j.id, "</div>\n        <div>pipes size is ").concat(this.model.pipes.length, "</div>\n      </div>\n    ");
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

},{}],23:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var valve_model_1 = __importDefault(require("../models/ghost/heating/valve.model"));
var vect_1 = require("../../geometry/vect");
var Valve = /** @class */function () {
    function Valve(view, model, ctx) {
        this.canvas = view;
        this.ctx = ctx;
    }
    Valve.prototype.drawGhost = function (valve) {
        var _this = this;
        var _a;
        this.ctx.save();
        this.ctx.beginPath();
        var normVector, normVectorReversed;
        if (valve.pipes.length == 0) {
            normVector = new vect_1.Vector(1, 0);
            normVectorReversed = normVector.reverse();
        } else {
            var valvePipe = valve.pipes[0]; // get one from two pipe for angle detection
            var pipeEnd = ((_a = valvePipe.from.target) === null || _a === void 0 ? void 0 : _a.id) === valve.id ? valvePipe.from : valvePipe.to;
            var pipeOppositeEnd = pipeEnd.getOpposite();
            normVector = pipeOppositeEnd.vec.sub(pipeEnd.vec).normalize();
            normVectorReversed = normVector.reverse();
        }
        var points = [];
        points.push(normVector.multiply(valve.width).perpendicular("left").sum(normVector.multiply(valve.length)).sum(valve.center), normVector.multiply(valve.width).perpendicular("right").sum(normVector.multiply(valve.length)).sum(valve.center), normVector.sum(valve.center), normVectorReversed.multiply(valve.width).perpendicular("left").sum(normVectorReversed.multiply(valve.length)).sum(valve.center), normVectorReversed.multiply(valve.width).perpendicular("right").sum(normVectorReversed.multiply(valve.length)).sum(valve.center), normVector.sum(valve.center));
        points.map(function (p, index) {
            var wP = _this.canvas.model.getLocalCoordinates(p.x, p.y);
            if (index === 0) _this.ctx.moveTo(wP.x, wP.y);
            _this.ctx.lineTo(wP.x, wP.y);
        });
        this.ctx.lineWidth = 2;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        var wP = this.canvas.model.getLocalCoordinates(valve.center.x, valve.center.y);
        this.ctx.moveTo(wP.x, wP.y);
        this.ctx.arc(wP.x, wP.y, valve.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.restore();
    };
    Valve.prototype.drawValves = function () {
        var _this = this;
        this.canvas.model.valves.map(function (v) {
            _this.drawValve(v);
        });
    };
    Valve.prototype.drawValve = function (valve) {
        var _this = this;
        var _a;
        if (valve.pipes.length == 0) return;
        this.ctx.save();
        this.ctx.beginPath();
        var valvePipe = valve.pipes[0]; // get one from two pipe for angle detection
        var pipeEnd = ((_a = valvePipe.from.target) === null || _a === void 0 ? void 0 : _a.id) === valve.id ? valvePipe.from : valvePipe.to;
        var pipeOppositeEnd = pipeEnd.getOpposite();
        var normVector = pipeOppositeEnd.vec.sub(pipeEnd.vec).normalize();
        var normVectorReversed = normVector.reverse();
        var points = [];
        points.push(normVector.multiply(valve.width).perpendicular("left").sum(normVector.multiply(valve.length)).sum(valve.center), normVector.multiply(valve.width).perpendicular("right").sum(normVector.multiply(valve.length)).sum(valve.center), normVector.sum(valve.center), normVectorReversed.multiply(valve.width).perpendicular("left").sum(normVectorReversed.multiply(valve.length)).sum(valve.center), normVectorReversed.multiply(valve.width).perpendicular("right").sum(normVectorReversed.multiply(valve.length)).sum(valve.center), normVector.sum(valve.center));
        points.map(function (p, index) {
            var wP = _this.canvas.model.getLocalCoordinates(p.x, p.y);
            if (index === 0) _this.ctx.moveTo(wP.x, wP.y);
            _this.ctx.lineTo(wP.x, wP.y);
        });
        this.ctx.lineWidth = 2;
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.beginPath();
        var wP = this.canvas.model.getLocalCoordinates(valve.center.x, valve.center.y);
        this.ctx.moveTo(wP.x, wP.y);
        this.ctx.arc(wP.x, wP.y, valve.radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.fillStyle = "white";
        this.ctx.fill();
        this.ctx.restore();
    };
    Valve.prototype.draw = function () {
        this.drawValves();
        if (this.canvas.model.placingObject && this.canvas.model.placingObject instanceof valve_model_1.default) {
            this.drawGhost(this.canvas.model.placingObject);
        }
    };
    return Valve;
}();
exports.default = Valve;

},{"../../geometry/vect":25,"../models/ghost/heating/valve.model":11}],24:[function(require,module,exports){
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

},{"./2d":4}],25:[function(require,module,exports){
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
    Vector.prototype.angle1 = function (v) {
        return Math.atan2(this.x * v.y - v.x * this.y, this.x * v.x + this.y * v.y);
    };
    Vector.prototype.product = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.normalize = function () {
        if (this.length === 0) {
            console.warn("v is zero");
            new Vector(0, 0);
        }
        return new Vector(this.x / this.length, this.y / this.length);
    };
    Vector.prototype.multiply = function (a) {
        return new Vector(this.x * a, this.y * a);
    };
    Vector.prototype.perpendicular = function (side) {
        if (side === void 0) {
            side = "left";
        }
        if (side === "left") {
            return new Vector(this.y, -this.x);
        } else {
            return new Vector(-this.y, this.x);
        }
    };
    Vector.prototype.reverse = function () {
        return new Vector(-this.x, -this.y);
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
                ctx.beginPath();
                ctx.arc(_this.x, _this.y, 5, 0, 2 * Math.PI);
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
    Vector.prototype.scalar = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    return Vector;
}();
exports.Vector = Vector;

},{}],26:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var app = new app_1.default();
app.run();

},{"./app":24}],27:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var info_panel_view_1 = __importDefault(require("../view/info-panel.view"));
var InfoPanel = /** @class */function () {
    function InfoPanel(model) {
        var _this = this;
        this.panelModel = {};
        this.model = model;
        this.view = new info_panel_view_1.default(this.panelModel);
        if (this.view.pipeModeFrame) {
            this.view.pipeModeFrame.addEventListener("click", this.pipeModeHandle.bind(this));
        }
        if (this.view.pipeType) {
            this.view.pipeType.forEach(function (e) {
                e.addEventListener("change", _this.pipeTypeHandle.bind(_this));
            });
        }
    }
    InfoPanel.prototype.pipeModeHandle = function () {};
    InfoPanel.prototype.pipeTypeHandle = function (e) {
        var cT = e.currentTarget;
        var value = cT.value;
        if (value === "supply" || value === "return") {
            this.model.updateSubMode(value);
        }
    };
    return InfoPanel;
}();
exports.default = InfoPanel;

},{"../view/info-panel.view":29}],28:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var toolbar_view_1 = __importDefault(require("../view/toolbar.view"));
var Toolbar = /** @class */function () {
    function Toolbar(model) {
        var _this = this;
        this.toolbarModel = { menu: "default" }; // now it is small object. if it gets bigger move it
        this.model = model;
        this.view = new toolbar_view_1.default(this.toolbarModel);
        if (this.view.menuItems) {
            Array.from(this.view.menuItems).map(function (e) {
                e.addEventListener("click", _this.handleMenu.bind(_this));
            });
        }
        if (this.view.subMenuItems) {
            Array.from(this.view.subMenuItems).map(function (e) {
                e.addEventListener("click", _this.handleMode.bind(_this));
            });
        }
    }
    Toolbar.prototype.handleMenu = function (e) {
        var cT = e.currentTarget;
        var value = cT.id;
        switch (value) {
            case "toolbar_selection":
                this.model.updateMode("default");
                this.toolbarModel.menu = "default";
                break;
            case "toolbar_heating":
                this.toolbarModel.menu = "heating";
                break;
            case "toolbar_architecture":
                this.toolbarModel.menu = "architecture";
                break;
            case "toolbar_ventilation":
                this.toolbarModel.menu = "ventilation";
                break;
            default:
                this.model.updateMode("default");
                this.toolbarModel.menu = "default";
        }
        this.view.render();
    };
    Toolbar.prototype.handleMode = function (e) {
        var cT = e.currentTarget;
        var value = cT.getAttribute("data-value");
        if (value === "default" || value === "wall" || value === "pipe" || value === "radiator" || value === "valve") {
            this.model.updateMode(value);
        }
    };
    return Toolbar;
}();
exports.default = Toolbar;

},{"../view/toolbar.view":30}],29:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var InfoPanel = /** @class */function () {
    function InfoPanel(model) {
        this.model = model;
        this.container = document.querySelector("#infoPanel");
        this.pipeModeFrame = document.querySelector("#pipeModeFrame");
        this.pipeType = document.querySelectorAll("[name='mode-switch-pipe']");
    }
    InfoPanel.prototype.render = function () {};
    return InfoPanel;
}();
exports.default = InfoPanel;

},{}],30:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Toolbar = /** @class */function () {
    function Toolbar(model) {
        this.model = model;
        this.container = document.querySelector(".toolbar");
        this.menu = document.querySelector(".menu");
        this.menuItems = document.querySelectorAll(".menuItem");
        this.subMenus = document.querySelectorAll(".subMenu");
        this.subMenuItems = document.querySelectorAll(".subMenuItem");
    }
    Toolbar.prototype.render = function () {
        var _this = this;
        if (!this.subMenus || !this.menu || !this.menuItems || !this.container) return;
        Array.from(this.menuItems).map(function (menu) {
            if ("toolbar_" + _this.model.menu === menu.id) {
                menu.style.background = "cadetblue";
            } else {
                menu.style.background = "black";
            }
        });
        Array.from(this.subMenus).map(function (subMenu) {
            subMenu.style.display = "none";
            if (_this.model.menu === "default") {
                subMenu.style.display = "none";
            } else {
                if ("toolbar_" + _this.model.menu === subMenu.getAttribute("data-tab")) {
                    subMenu.style.display = "flex";
                }
            }
        });
    };
    return Toolbar;
}();
exports.default = Toolbar;

},{}],31:[function(require,module,exports){
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

},{}]},{},[26])

//# sourceMappingURL=bundle.js.map
