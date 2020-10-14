"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyPath = stringifyPath;
exports.resolvePath = resolvePath;
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _cyclic = require("./cyclic.js");

var Validation = /*#__PURE__*/function () {
  // Tracks whether we're in validation of cyclic objects.
  function Validation(input) {
    var _this$path;

    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var path = arguments.length > 2 ? arguments[2] : undefined;
    (0, _classCallCheck2["default"])(this, Validation);
    (0, _defineProperty2["default"])(this, "input", void 0);
    (0, _defineProperty2["default"])(this, "path", []);
    (0, _defineProperty2["default"])(this, "prefix", void 0);
    (0, _defineProperty2["default"])(this, "errors", []);
    (0, _defineProperty2["default"])(this, "cyclic", new WeakMap());
    this.input = input;
    this.prefix = prefix;
    if (path) (_this$path = this.path).push.apply(_this$path, (0, _toConsumableArray2["default"])(path));
  }

  (0, _createClass2["default"])(Validation, [{
    key: "inCycle",
    value: function inCycle(type, input) {
      var tracked = this.cyclic.get(type);

      if (!tracked) {
        return false;
      } else {
        return (0, _cyclic.weakSetHas)(tracked, input);
      }
    }
  }, {
    key: "startCycle",
    value: function startCycle(type, input) {
      var tracked = this.cyclic.get(type);

      if (!tracked) {
        tracked = new WeakSet();
        this.cyclic.set(type, tracked);
      }

      (0, _cyclic.weakSetAdd)(tracked, input);
    }
  }, {
    key: "endCycle",
    value: function endCycle(type, input) {
      var tracked = this.cyclic.get(type);

      if (tracked) {
        (0, _cyclic.weakSetDelete)(tracked, input);
      }
    }
  }, {
    key: "hasErrors",
    value: function hasErrors() {
      return this.errors.length > 0;
    }
  }]);
  return Validation;
}();

exports["default"] = Validation;
var validIdentifierOrAccessor = /^[$A-Z_][0-9A-Z_$[\].]*$/i;

function stringifyPath(path) {
  if (!path.length) {
    return 'Value';
  }

  var length = path.length;
  var parts = new Array(length);

  for (var i = 0; i < length; i++) {
    var part = path[i];

    if (part === '[[Return Type]]') {
      parts[i] = 'Return Type';
    } else if (typeof part !== 'string' || !validIdentifierOrAccessor.test(part)) {
      parts[i] = "[".concat(String(part), "]");
    } else if (i > 0) {
      parts[i] = ".".concat(String(part));
    } else {
      parts[i] = String(part);
    }
  }

  return parts.join('');
}

function resolvePath(input, path) {
  var subject = input;
  var length = path.length;

  for (var i = 0; i < length; i++) {
    if (subject == null) {
      return undefined;
    }

    var part = path[i];

    if (part === '[[Return Type]]') {
      continue;
    }

    if (subject instanceof Map) {
      subject = subject.get(part);
    } else {
      subject = subject[part];
    }
  }

  return subject;
}