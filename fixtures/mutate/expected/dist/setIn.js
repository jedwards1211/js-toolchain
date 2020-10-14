"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _updateIn = _interopRequireDefault(require("./updateIn.js"));

function setIn(obj, path, newValue) {
  return (0, _updateIn["default"])(obj, path, function () {
    return newValue;
  });
}

var _default = setIn;
exports["default"] = _default;
module.exports = exports.default;