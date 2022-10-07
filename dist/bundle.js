(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_view_1 = __importDefault(require("../views/canvas.view"));
var canvas_model_1 = __importDefault(require("../models/canvas.model"));
var CanvasController = /** @class */function () {
    function CanvasController() {
        this.view = new canvas_view_1.default();
        this.model = new canvas_model_1.default();
    }
    CanvasController.prototype.mouseMove = function () {
        this.view.draw();
    };
    CanvasController.prototype.mouseDown = function () {};
    CanvasController.prototype.mouseUp = function () {};
    return CanvasController;
}();
exports.default = CanvasController;

},{"../models/canvas.model":3,"../views/canvas.view":4}],2:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var canvas_controller_1 = __importDefault(require("./canvas.controller"));
var CoreController = /** @class */function () {
    function CoreController() {
        this.canvas = new canvas_controller_1.default();
    }
    CoreController.prototype.mouseMove = function () {
        this.canvas.mouseMove();
    };
    return CoreController;
}();
exports.default = CoreController;

},{"./canvas.controller":1}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CanvasModel = /** @class */function () {
    function CanvasModel() {}
    return CanvasModel;
}();
exports.default = CanvasModel;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var CanvasView = /** @class */function () {
    function CanvasView() {
        this.container = document.querySelector("#editor");
        this.init();
    }
    CanvasView.prototype.init = function () {
        if (!this.container) return;
        this.container.style.height = '600px';
        this.container.style.width = '900px';
        this.container.style.border = '1px solid black';
    };
    CanvasView.prototype.draw = function () {
        this.drawNet();
    };
    CanvasView.prototype.drawNet = function () {
        var _a;
        var ctx = (_a = this.container) === null || _a === void 0 ? void 0 : _a.getContext("2d");
        if (!ctx) return;
    };
    return CanvasView;
}();
exports.default = CanvasView;

},{}],5:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_controller_1 = __importDefault(require("./2d/controllers/core.controller"));
var App = /** @class */function () {
    function App() {
        this.controller2D = new core_controller_1.default();
    }
    App.prototype.run = function () {};
    return App;
}();
exports.default = App;

},{"./2d/controllers/core.controller":2}],6:[function(require,module,exports){
"use strict";

var __importDefault = undefined && undefined.__importDefault || function (mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = __importDefault(require("./app"));
var app = new app_1.default();
app.run();

},{"./app":5}]},{},[6])

//# sourceMappingURL=bundle.js.map
