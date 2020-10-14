import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { weakSetAdd, weakSetDelete, weakSetHas } from "./cyclic.mjs";

var Validation = /*#__PURE__*/function () {
  // Tracks whether we're in validation of cyclic objects.
  function Validation(input) {
    var _this$path;

    var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
    var path = arguments.length > 2 ? arguments[2] : undefined;

    _classCallCheck(this, Validation);

    _defineProperty(this, "input", void 0);

    _defineProperty(this, "path", []);

    _defineProperty(this, "prefix", void 0);

    _defineProperty(this, "errors", []);

    _defineProperty(this, "cyclic", new WeakMap());

    this.input = input;
    this.prefix = prefix;
    if (path) (_this$path = this.path).push.apply(_this$path, _toConsumableArray(path));
  }

  _createClass(Validation, [{
    key: "inCycle",
    value: function inCycle(type, input) {
      var tracked = this.cyclic.get(type);

      if (!tracked) {
        return false;
      } else {
        return weakSetHas(tracked, input);
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

      weakSetAdd(tracked, input);
    }
  }, {
    key: "endCycle",
    value: function endCycle(type, input) {
      var tracked = this.cyclic.get(type);

      if (tracked) {
        weakSetDelete(tracked, input);
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

export { Validation as default };
var validIdentifierOrAccessor = /^[$A-Z_][0-9A-Z_$[\].]*$/i;
export function stringifyPath(path) {
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
export function resolvePath(input, path) {
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