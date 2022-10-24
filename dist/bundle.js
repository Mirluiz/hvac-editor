(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var stats_view_1 = __importDefault(require("../views/stats.view"));
var pipe_model_1 = __importDefault(require("../models/heating/pipe.model"));
var valve_model_1 = __importDefault(require("../models/heating/valve.model"));
var vect_1 = require("../../geometry/vect");
var Canvas = /** @class */function () {
    function Canvas() {
        this.model = new canvas_model_1.default();
        this.view = new canvas_view_1.default(this.model);
        this.stats = new stats_view_1.default(this.model);
        if (this.view.container) {
            this.view.container.addEventListener("mousemove", this.mouseMove.bind(this));
            this.view.container.addEventListener("mousedown", this.mouseDown.bind(this));
            this.view.container.addEventListener("mouseup", this.mouseUp.bind(this));
            this.view.container.addEventListener("wheel", this.mouseWheel.bind(this));
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
        if (!this.model.actionObject) {
            if (this.model.config.net.bind) {
                _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
                _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
            }
            switch (this.model.actionMode) {
                case "wall":
                    this.model.actionObject = this.model.addWall(new vect_1.Vector(_mouse.x, _mouse.y), new vect_1.Vector(_mouse.x, _mouse.y));
                    break;
                case "pipe":
                    this.model.actionObject = new pipe_model_1.default(new vect_1.Vector(_mouse.x, _mouse.y), new vect_1.Vector(_mouse.x, _mouse.y));
                    break;
            }
        } else {
            switch (this.model.actionMode) {
                case "wall":
                    this.model.addWall(this.model.actionObject.start, this.model.actionObject.end);
                    break;
                case "pipe":
                    this.model.addPipe(this.model.actionObject.start, this.model.actionObject.end);
                    break;
            }
            this.model.actionObject = null;
        }
        if (!this.model.placingObject) {
            if (this.model.config.net.bind) {
                _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
                _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
            }
            switch (this.model.actionMode) {
                case "valve":
                    this.model.placingObject = new valve_model_1.default(new vect_1.Vector(_mouse.x, _mouse.y));
                    break;
            }
        } else {
            switch (this.model.actionMode) {
                case "valve":
                    this.model.addValve(this.model.placingObject.center);
                    break;
            }
            this.model.actionObject = null;
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
        if (this.model.actionObject) {
            if (this.model.actionObject instanceof pipe_model_1.default) {
                var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
                if (this.model.config.net.bind) {
                    _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
                    _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
                }
                this.model.actionObject.end.x = _mouse.x;
                this.model.actionObject.end.y = _mouse.y;
                this.model.actionObject.getNearestCoordinateOnPipe(new vect_1.Vector(this.model.mouse.x, this.model.mouse.y), this.model.pipes[0]);
            }
        }
        if (this.model.placingObject) {
            if (this.model.placingObject instanceof valve_model_1.default) {
                var _mouse = new vect_1.Vector(this.model.mouse.x, this.model.mouse.y);
                if (this.model.config.net.bind) {
                    _mouse.x = Math.round(_mouse.x / this.model.config.net.step) * this.model.config.net.step;
                    _mouse.y = Math.round(_mouse.y / this.model.config.net.step) * this.model.config.net.step;
                }
                this.model.placingObject.center.x = _mouse.x;
                this.model.placingObject.center.y = _mouse.y;
            }
        }
        this.stats.render();
        this.view.draw();
    };
    Canvas.prototype.mouseUp = function (e) {
        this.model.clicked = false;
    };
    return Canvas;
}();
exports.default = Canvas;

},{"../../geometry/vect":15,"../models/canvas.model":5,"../models/heating/pipe.model":8,"../models/heating/valve.model":9,"../views/canvas.view":11,"../views/stats.view":13}],2:[function(require,module,exports){
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
            this.model.actionMode = value;
        }
    };
    return Mode;
}();
exports.default = Mode;

},{"../views/mode.view":12}],3:[function(require,module,exports){
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

},{"./controllers/canvas.controller":1,"./controllers/mode.controller":2}],4:[function(require,module,exports){
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
    function Wall(start, end) {
        return _super.call(this, start, end) || this;
    }
    return Wall;
}(line_model_1.default);
exports.default = Wall;

},{"../geometry/line.model":7}],5:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var wall_model_1 = __importDefault(require("./architecture/wall.model"));
var pipe_model_1 = __importDefault(require("./heating/pipe.model"));
var valve_model_1 = __importDefault(require("./heating/valve.model"));
var Canvas = /** @class */function () {
    function Canvas() {
        this._walls = [];
        this._pipes = [];
        this._valves = [];
        this.actionMode = "pipe";
        this.actionObject = null;
        this.placingObject = null;
        this.nearestObject = null;
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
            }
        };
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
    Canvas.prototype.addWall = function (start, end) {
        var wall = new wall_model_1.default(start, end);
        wall.color = "black";
        wall.width = 5;
        this.walls.push(wall);
        this.walls = this.walls;
        return wall;
    };
    Canvas.prototype.addPipe = function (start, end) {
        var pipe = new pipe_model_1.default(start, end);
        pipe.color = "red";
        pipe.width = 2;
        this.pipes.push(pipe);
        this.pipes = this.pipes;
        return pipe;
    };
    Canvas.prototype.addValve = function (center) {
        var valve = new valve_model_1.default(center);
        valve.color = "red";
        valve.width = 2;
        this.valves.push(valve);
        this.valves = this.valves;
        return valve;
    };
    return Canvas;
}();
exports.default = Canvas;

},{"./architecture/wall.model":4,"./heating/pipe.model":8,"./heating/valve.model":9}],6:[function(require,module,exports){
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

},{"../main.model":10}],7:[function(require,module,exports){
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
        _this.color = "#fff";
        _this.width = 1;
        _this.start = start;
        _this.end = end;
        return _this;
    }
    return Line;
}(main_model_1.default);
exports.default = Line;

},{"../main.model":10}],8:[function(require,module,exports){
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
        return _super.call(this, start, end) || this;
    }
    Pipe.prototype.getNearestPipe = function (pipes) {
        var _this = this;
        var pipe = pipes.find(function (pipe) {
            if (pipe._id === _this._id) return;
            var start = pipe.start.distanceTo(_this.end);
            var end = pipe.end.distanceTo(_this.end);
            return start && start < 30 || end && end < 30;
        });
        return pipe;
    };
    Pipe.prototype.getNearestCoordinateOnPipe = function (coord, pipe) {
        var _coord = coord.sub(pipe.start);
    };
    return Pipe;
}(line_model_1.default);
exports.default = Pipe;

},{"../geometry/line.model":7}],9:[function(require,module,exports){
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
var Valve = /** @class */function (_super) {
    __extends(Valve, _super);
    function Valve(center) {
        return _super.call(this, center) || this;
    }
    return Valve;
}(arc_model_1.default);
exports.default = Valve;

},{"../geometry/arc.model":6}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../../utils");
var Main = /** @class */function () {
    function Main() {
        this._id = (0, utils_1.uuid)();
    }
    return Main;
}();
exports.default = Main;

},{"../../utils":17}],11:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var vect_1 = require("../../geometry/vect");
var valve_model_1 = __importDefault(require("../models/heating/valve.model"));
var line_model_1 = __importDefault(require("../models/geometry/line.model"));
var pipe_model_1 = __importDefault(require("../models/heating/pipe.model"));
var Canvas = /** @class */function () {
    function Canvas(model) {
        this.model = model;
        this.container = document.querySelector("#editor");
        this.init();
    }
    Canvas.prototype.init = function () {
        this.initCanvasContainer();
    };
    Canvas.prototype.draw = function () {
        this.clear();
        this.drawNet();
        this.drawMouse();
        this.drawWalls();
        this.drawPipes();
        this.drawValves();
        this.drawTempObjects();
        this.drawNearestObject();
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
    Canvas.prototype.drawPipes = function () {
        var _this_1 = this;
        var pipes = this.model.pipes;
        pipes === null || pipes === void 0 ? void 0 : pipes.map(function (pipe) {
            _this_1.drawLine(pipe);
        });
    };
    Canvas.prototype.drawLine = function (line) {
        if (!this.container) return;
        var ctx = this.container.getContext("2d");
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        var from = this.getWorldCoordinates(line.start.x, line.start.y);
        var to = this.getWorldCoordinates(line.end.x, line.end.y);
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = line.color;
        ctx.lineWidth = line.width;
        ctx.stroke();
        ctx.restore();
    };
    Canvas.prototype.drawValves = function () {
        var _this_1 = this;
        var valves = this.model.valves;
        valves === null || valves === void 0 ? void 0 : valves.map(function (valve) {
            _this_1.drawValve(valve);
        });
    };
    Canvas.prototype.drawValve = function (valve) {
        if (!this.container) return;
        var ctx = this.container.getContext("2d");
        if (!ctx) return;
        ctx.save();
        ctx.beginPath();
        var c = this.getWorldCoordinates(valve.center.x, valve.center.y);
        ctx.arc(c.x, c.y, valve.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.restore();
    };
    Canvas.prototype.drawTempObjects = function () {
        if (this.model.placingObject instanceof valve_model_1.default) {
            this.drawValve(this.model.placingObject);
        }
        if (this.model.actionObject instanceof pipe_model_1.default) {
            this.drawLine(this.model.actionObject);
        }
    };
    Canvas.prototype.drawNearestObject = function () {
        if (this.model.actionObject instanceof pipe_model_1.default) {
            if (this.model.nearestObject) {
                var line = new line_model_1.default(this.model.actionObject.end, this.model.nearestObject);
                line.color = "green";
                this.drawLine(line);
            }
        }
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

},{"../../geometry/vect":15,"../models/geometry/line.model":7,"../models/heating/pipe.model":8,"../models/heating/valve.model":9}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
        var _a, _b, _c, _d, _e, _f, _g, _h;
        if (!this.container) return;
        this.container.innerHTML = "\n      <div style=\"display: flex; flex-direction: column\">\n        <div>x - ".concat(Math.round(this.model.offset.x), " \n        / y - ").concat(Math.round(this.model.offset.y), "</div>\n        \n        <div>x - ").concat(Math.round((_b = (_a = this.model.mouse) === null || _a === void 0 ? void 0 : _a.x) !== null && _b !== void 0 ? _b : 0), " \n        / y - ").concat(Math.round((_d = (_c = this.model.mouse) === null || _c === void 0 ? void 0 : _c.y) !== null && _d !== void 0 ? _d : 0), "</div>\n        \n        <div>scale - ").concat(this.model.scale.amount, "</div>\n        <div>width - ").concat((_e = this.model.canvasSize) === null || _e === void 0 ? void 0 : _e.x, " / height - ").concat((_f = this.model.canvasSize) === null || _f === void 0 ? void 0 : _f.y, " / </div>\n        <div>ratio x ").concat((_g = this.model.mouseCanvasRatio) === null || _g === void 0 ? void 0 : _g.x, " / y ").concat((_h = this.model.mouseCanvasRatio) === null || _h === void 0 ? void 0 : _h.y, "</div>\n        <div>mode is ").concat(this.model.actionMode, "</div>\n      </div>\n    ");
    };
    Stats.prototype.initContainer = function () {
        if (!this.container) return;
        this.container.style.height = "150px";
        this.container.style.width = "200px";
        this.container.style.border = "1px solid black";
        this.container.style.marginLeft = "10px";
    };
    return Stats;
}();
exports.default = Stats;

},{}],14:[function(require,module,exports){
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

},{"./2d":3}],15:[function(require,module,exports){
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
        return 1;
    };
    Object.defineProperty(Vector.prototype, "length", {
        get: function get() {
            return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
        },
        enumerable: false,
        configurable: true
    });
    Vector.prototype.projection = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.sub = function (v) {
        return new Vector(this.x - v.x, this.y - v.y);
    };
    Vector.prototype.angle = function (v) {
        return Math.acos((this.x * v.x + this.y * v.y) / (this.length * v.length));
    };
    return Vector;
}();
exports.Vector = Vector;

},{}],16:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var app = new app_1.default();
app.run();

},{"./app":14}],17:[function(require,module,exports){
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

},{}]},{},[16])

//# sourceMappingURL=bundle.js.map
