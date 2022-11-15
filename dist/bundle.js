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
        // this.stats.render();
        // this.view.draw();
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
        // this.stats.render();
        // this.view.draw();
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
        // this.stats.render();
        // this.view.draw();
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
        // this.stats.render();
        // this.view.draw();
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../models/canvas.model":5,"../views/canvas.view":17,"../views/stats.view":18,"./object.controller":2,"./pipe.controller":3}],2:[function(require,module,exports){
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

},{"../../geometry/vect":21,"../models/ghost/heating/radiator.model":9,"../models/ghost/heating/valve.model":10,"../models/heating/radiator.model":13,"../models/heating/valve.model":14}],3:[function(require,module,exports){
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
                this.model.actionObject.to.vec.x = target.io.getVecAbs().x;
                this.model.actionObject.to.vec.y = target.io.getVecAbs().y;
            } else if ((target === null || target === void 0 ? void 0 : target.object) instanceof fitting_model_1.default) {
                this.model.actionObject.to.vec.x = target.object.center.x;
                this.model.actionObject.to.vec.y = target.object.center.y;
            } else if (((_b = target === null || target === void 0 ? void 0 : target.body) === null || _b === void 0 ? void 0 : _b.object) instanceof pipe_model_2.default) {
                this.model.actionObject.to.vec.x = target.body.vec.x;
                this.model.actionObject.to.vec.y = target.body.vec.y;
            } else {
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

},{"../../geometry/vect":21,"../models/ghost/heating/pipe.model":8,"../models/heating/fitting.model":11,"../models/heating/pipe.model":12}],4:[function(require,module,exports){
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

},{"../ui/controller/info-panel.controller":25,"../ui/controller/toolbar.controller":26,"./controllers/canvas.controller":1}],5:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var valve_model_1 = __importDefault(require("./ghost/heating/valve.model"));
var overlap_model_1 = __importDefault(require("../overlap.model"));
var common_1 = require("../../_test_/common");
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

},{"../../_test_/common":19,"../../geometry/vect":21,"../overlap.model":16,"./ghost/heating/radiator.model":9,"./ghost/heating/valve.model":10}],6:[function(require,module,exports){
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

},{"../main.model":15}],7:[function(require,module,exports){
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

},{"../main.model":15}],8:[function(require,module,exports){
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
            vec: from,
            getPipe: function getPipe() {
                return _this;
            },
            getOpposite: function getOpposite() {
                return _this.to;
            }
        }, {
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
            return "black";
        },
        enumerable: false,
        configurable: true
    });
    Pipe.prototype.validation = function () {
        var _this = this;
        var can = true;
        [this.from, this.to].map(function (end) {
            if (!can) return;
            var overlaps = _this.model.overlap.direct(end.vec);
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

},{"../../geometry/line.model":7,"../../heating/fitting.model":11}],9:[function(require,module,exports){
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

},{"../../../../geometry/vect":21,"../../main.model":15}],10:[function(require,module,exports){
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

},{"../../geometry/arc.model":6}],11:[function(require,module,exports){
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
        _this.width = 20;
        _this.height = 20;
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

},{"../geometry/arc.model":6}],12:[function(require,module,exports){
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

},{"../../../geometry/vect":21,"../geometry/line.model":7,"./fitting.model":11}],13:[function(require,module,exports){
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

},{"../../../geometry/vect":21,"../main.model":15}],14:[function(require,module,exports){
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

},{"../../../geometry/vect":21,"../geometry/arc.model":6,"./pipe.model":12}],15:[function(require,module,exports){
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

},{"../../utils":29}],16:[function(require,module,exports){
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
        this.first = null;
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
        this.list = __spreadArray(__spreadArray(__spreadArray([], this.pipeOverlap(v), true), this.IOOverlap(v), true), this.fittingOverlap(v), true);
        this.boundList = __spreadArray(__spreadArray(__spreadArray([], this.pipeOverlap(netBoundMouse), true), this.IOOverlap(netBoundMouse), true), this.fittingOverlap(netBoundMouse), true);
        //problem. it updates only one. fix this
        // if (this.list.length === 0 && this.boundList.length === 0) {
        this.boundMouse = netBoundMouse.clone();
        // }
        this.firstOverlap(v);
    };
    Overlap.prototype.direct = function (vec) {
        var list = __spreadArray(__spreadArray(__spreadArray([], this.pipeOverlap(vec), true), this.IOOverlap(vec), true), this.fittingOverlap(vec), true);
        return list;
    };
    /**
     * it is sorted by height (more height -> more closer to user)
     */
    Overlap.prototype.firstOverlap = function (vec) {
        var overlaps = __spreadArray(__spreadArray([], this.list, true), this.boundList, true);
        if (overlaps.length > 0) {
            overlaps.sort(function (a, b) {
                var aL = 0;
                var bL = 0;
                if (a.fitting) {
                    aL = a.fitting.center.sub(vec).length;
                } else if (a.io) {
                    aL = a.io.getVecAbs().sub(vec).length;
                } else if (a.body) {
                    aL = a.body.vec.sub(vec).length;
                }
                if (b.fitting) {
                    bL = b.fitting.center.sub(vec).length;
                } else if (b.io) {
                    bL = b.io.getVecAbs().sub(vec).length;
                } else if (b.body) {
                    bL = b.body.vec.sub(vec).length;
                }
                return aL - bL;
            });
        }
        if (overlaps.length > 0) {
            overlaps.sort(function (a, b) {
                var aZ = 0;
                var bZ = 0;
                if (a.fitting) {
                    aZ = a.fitting.center.z + a.fitting.width;
                } else if (a.io) {
                    aZ = a.io.getVecAbs().z;
                } else if (a.body) {
                    aZ = a.body.vec.z;
                }
                if (b.fitting) {
                    bZ = b.fitting.center.z + b.fitting.width;
                } else if (b.io) {
                    bZ = b.io.getVecAbs().z;
                } else if (b.body) {
                    bZ = b.body.vec.z;
                }
                return aZ - bZ;
            });
        }
        this.first = overlaps.reverse()[0];
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
    Overlap.prototype.fittingOverlap = function (vec) {
        var ret = [];
        var bind = this.model.config.overlap.bindDistance;
        this.model.fittings.map(function (fitting) {
            var _f = null;
            if (fitting.center.sub(vec).length <= bind) {
                _f = {
                    id: fitting.id,
                    fitting: fitting
                };
            }
            if (_f) ret.push(_f);
        });
        if (ret.length > 1) {
            ret.sort(function (a, b) {
                return 1;
                // return a.io?.vec.x -
            });
        }
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

},{"../geometry/vect":21}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var shader_1 = require("../../shaders/shader");
var m3_1 = require("../../math/m3");
var Canvas = /** @class */function () {
    function Canvas(model) {
        this.pipe = null;
        this.valve = null;
        this.fitting = null;
        this.radiator = null;
        this.gl = null;
        this.objects = [];
        this.model = model;
        this.container = document.querySelector("#editor");
        // this.init();
    }
    Canvas.prototype.init = function () {
        var _this = this;
        if (!this.container) return;
        this.initCanvasContainer();
        this.gl = this.container.getContext("webgl");
        if (this.gl === null) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        this.objects = [];
        var gl = this.gl;
        this.model.pipes.map(function (pipe) {
            var shaderProgram = _this.initShaderProgram(gl, (0, shader_1.vertex)(), (0, shader_1.fragment)());
            if (!shaderProgram) return;
            var buffer = _this.initBuffers(gl, pipe);
            var programInfo = {
                program: shaderProgram,
                attribLocations: {
                    vertexPosition: gl.getAttribLocation(shaderProgram, "a_position")
                },
                uniformLocations: {
                    resolutionLocation: gl.getUniformLocation(shaderProgram, "u_resolution"),
                    matrixLocation: gl.getUniformLocation(shaderProgram, "u_matrix")
                },
                buffer: buffer
            };
            _this.objects.push(programInfo);
        });
        if (!this.objects) return;
        this.drawScene();
    };
    //Array<{ position: WebGLBuffer | null }>
    Canvas.prototype.drawScene = function () {
        if (!this.gl) return;
        var gl = this.gl;
        var objects = this.objects;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        var model = this.model;
        objects.forEach(function (object) {
            if (!object || !object.buffer || !object.buffer.position) return;
            var size = 2; // 2 components per iteration
            var type = gl.FLOAT; // the data is 32bit floats
            var normalize = false; // don't normalize the data
            var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
            var offset = 0; // start at the beginning of the buffer
            var programInfo = object.program;
            gl.useProgram(programInfo);
            gl.enableVertexAttribArray(object.attribLocations.vertexPosition);
            // Setup all the needed attributes.
            gl.bindBuffer(gl.ARRAY_BUFFER, object.buffer.position);
            gl.vertexAttribPointer(object.attribLocations.vertexPosition, size, type, normalize, stride, offset);
            gl.uniform2f(object.uniformLocations.resolutionLocation, gl.canvas.width, gl.canvas.height);
            var translationMatrix = m3_1.m3.translation(model.offset.x, model.offset.y);
            var rotationMatrix = m3_1.m3.rotation(0);
            var scaleMatrix = m3_1.m3.scaling(model.scale.amount, model.scale.amount);
            // Multiply the matrices.
            var matrix = m3_1.m3.multiply(translationMatrix, rotationMatrix);
            // matrix = m3.multiply(matrix, scaleMatrix);
            // Set the matrix.
            gl.uniformMatrix3fv(object.uniformLocations.matrixLocation, false, matrix);
            // Draw
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        });
    };
    Canvas.prototype.initShaderProgram = function (gl, vsSource, fsSource) {
        var vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
        var fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShader || !fragmentShader) return;
        var shaderProgram = gl.createProgram();
        if (!shaderProgram) return;
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);
        // If creating the shader program failed, alert
        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Unable to initialize the shader program: ".concat(gl.getProgramInfoLog(shaderProgram)));
            return null;
        }
        return shaderProgram;
    };
    Canvas.prototype.loadShader = function (gl, type, source) {
        var shader = gl.createShader(type);
        if (!shader) return;
        // Send the source to the shader object
        gl.shaderSource(shader, source);
        // Compile the shader program
        gl.compileShader(shader);
        // See if it compiled successfully
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert("An error occurred compiling the shaders: ".concat(gl.getShaderInfoLog(shader)));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    };
    Canvas.prototype.initBuffers = function (gl, pipe) {
        var positionBuffer = gl.createBuffer();
        if (!positionBuffer) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        var x = pipe.from.vec.x;
        var y = pipe.from.vec.y;
        var width = pipe.width;
        var height = pipe.width;
        var x1 = x;
        var x2 = x + width;
        var y1 = y;
        var y2 = y + height;
        var positions = [x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2];
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        return {
            position: positionBuffer
        };
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

},{"../../math/m3":23,"../../shaders/shader":24}],18:[function(require,module,exports){
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
    // _3Pipes(model, pipes, step);s
    performanceCheck(model, pipes, step);
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
    [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                } else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            } else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 8);
                } else {
                    vec1 = new vect_1.Vector(8, 8);
                    vec2 = new vect_1.Vector(8, 4);
                }
            } else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(12, 4);
                } else {
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
    [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                } else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            } else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 0);
                } else {
                    vec1 = new vect_1.Vector(8, 0);
                    vec2 = new vect_1.Vector(8, 4);
                }
            } else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(12, 4);
                } else {
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
    [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 0);
                    vec2 = new vect_1.Vector(8, 4);
                } else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 0);
                }
            } else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                } else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            } else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(8, 8);
                } else {
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
    [[1, 1, 1], [1, 1, -1], [1, -1, 1], [1, -1, -1], [-1, 1, 1], [-1, 1, -1], [-1, -1, 1], [-1, -1, -1]].map(function (combination, combinationIndex) {
        combination.map(function (direction, index) {
            var vec1;
            var vec2;
            if (index === 0) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 0);
                    vec2 = new vect_1.Vector(4, 4);
                } else {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(4, 0);
                }
            } else if (index === 1) {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(8, 4);
                } else {
                    vec1 = new vect_1.Vector(8, 4);
                    vec2 = new vect_1.Vector(4, 4);
                }
            } else {
                if (direction === 1) {
                    vec1 = new vect_1.Vector(4, 4);
                    vec2 = new vect_1.Vector(4, 8);
                } else {
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
var performanceCheck = function performanceCheck(model, pipes, step) {
    new Array(10000).fill(undefined).map(function (value, index) {
        var vec1;
        var vec2;
        vec1 = new vect_1.Vector(4, 4);
        vec2 = new vect_1.Vector(8, 4);
        var offsetX = 100 * (index % 8);
        var offsetY = 20 * Math.round(index / 8);
        vec1.x = offsetX + vec1.x * step;
        vec1.y = offsetY + vec1.y * step;
        vec2.x = offsetX + vec2.x * step;
        vec2.y = offsetY + vec2.y * step;
        pipes.push(new pipe_model_1.default(model, vec1, vec2));
    });
};

},{"../2d/models/heating/pipe.model":12,"../geometry/vect":21}],20:[function(require,module,exports){
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
        this._2d.canvas.view.init();
        window.requestAnimationFrame(this.step.bind(this));
    };
    App.prototype.step = function () {
        this._2d.canvas.view.drawScene();
        window.requestAnimationFrame(this.step.bind(this));
    };
    return App;
}();
exports.default = App;

},{"./2d":4}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector = void 0;
var Vector = /** @class */function () {
    function Vector(x, y, z) {
        if (z === void 0) {
            z = 0;
        }
        this.x = x;
        this.y = y;
        this.z = z;
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
            // console.log("this.length", this.length, v.length);
            return Math.acos(Math.min(1, (this.x * v.x + this.y * v.y) / (this.length * v.length)));
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
exports.m3 = void 0;
exports.m3 = {
    translation: function translation(tx, ty) {
        return [1, 0, 0, 0, 1, 0, tx, ty, 1];
    },
    rotation: function rotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [c, -s, 0, s, c, 0, 0, 0, 1];
    },
    scaling: function scaling(sx, sy) {
        return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
    },
    multiply: function multiply(a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];
        return [b00 * a00 + b01 * a10 + b02 * a20, b00 * a01 + b01 * a11 + b02 * a21, b00 * a02 + b01 * a12 + b02 * a22, b10 * a00 + b11 * a10 + b12 * a20, b10 * a01 + b11 * a11 + b12 * a21, b10 * a02 + b11 * a12 + b12 * a22, b20 * a00 + b21 * a10 + b22 * a20, b20 * a01 + b21 * a11 + b22 * a21, b20 * a02 + b21 * a12 + b22 * a22];
    }
};

},{}],24:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.fragment = exports.vertex = void 0;
var vertex = function vertex() {
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
    return "\n    attribute vec2 a_position;\n\n    uniform vec2 u_resolution;\n    uniform mat3 u_matrix;\n    \n    void main() {\n        // Multiply the position by the matrix.\n        vec2 position = (u_matrix * vec3(a_position, 1)).xy;\n      \n        // convert the position from pixels to 0.0 to 1.0\n        vec2 zeroToOne = position / u_resolution;\n      \n        // convert from 0->1 to 0->2\n        vec2 zeroToTwo = zeroToOne * 2.0;\n      \n        // convert from 0->2 to -1->+1 (clipspace)\n        vec2 clipSpace = zeroToTwo - 1.0;\n      \n        gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n    }\n  ";
};
exports.vertex = vertex;
var fragment = function fragment() {
    return "\n    void main() {\n      gl_FragColor = vec4(0, 0, 0, 1);\n    }\n  ";
};
exports.fragment = fragment;

},{}],25:[function(require,module,exports){
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

},{"../view/info-panel.view":27}],26:[function(require,module,exports){
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

},{"../view/toolbar.view":28}],27:[function(require,module,exports){
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

},{}],28:[function(require,module,exports){
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

},{}],29:[function(require,module,exports){
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
