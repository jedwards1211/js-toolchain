"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = invariant;

function invariant(input, message) {
  if (!input) {
    var error = new Error(message);
    error.name = 'InvariantViolation';

    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(error, invariant);
    }

    throw error;
  }
}

module.exports = exports.default;