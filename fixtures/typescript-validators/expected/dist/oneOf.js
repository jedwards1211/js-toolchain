"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = oneOf;

var _UnionType = _interopRequireDefault(require("./types/UnionType.js"));

function oneOf() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return new _UnionType["default"](types);
}

module.exports = exports.default;