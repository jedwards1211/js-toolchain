"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addConstraints = addConstraints;
exports.collectConstraintErrors = collectConstraintErrors;
exports.constraintsAccept = constraintsAccept;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _marked = /*#__PURE__*/_regenerator["default"].mark(collectConstraintErrors);

/**
 * Add constraints to the given subject type.
 */
function addConstraints(subject) {
  var _subject$constraints;

  for (var _len = arguments.length, constraints = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    constraints[_key - 1] = arguments[_key];
  }

  (_subject$constraints = subject.constraints).push.apply(_subject$constraints, constraints);
}
/**
 * Collect any errors from constraints on the given subject type.
 */


function collectConstraintErrors(subject, validation, path) {
  var constraints,
      length,
      _len2,
      input,
      _key2,
      i,
      constraint,
      violation,
      _args = arguments;

  return _regenerator["default"].wrap(function collectConstraintErrors$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          constraints = subject.constraints;
          length = constraints.length;

          for (_len2 = _args.length, input = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
            input[_key2 - 3] = _args[_key2];
          }

          i = 0;

        case 4:
          if (!(i < length)) {
            _context.next = 13;
            break;
          }

          constraint = constraints[i];
          violation = constraint.apply(void 0, input);

          if (!(typeof violation === 'string')) {
            _context.next = 10;
            break;
          }

          _context.next = 10;
          return [path, violation, subject];

        case 10:
          i++;
          _context.next = 4;
          break;

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, _marked);
}
/**
 * Determine whether the input passes the constraints on the subject type.
 */


function constraintsAccept(subject) {
  var constraints = subject.constraints;
  var length = constraints.length;

  for (var _len3 = arguments.length, input = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    input[_key3 - 1] = arguments[_key3];
  }

  for (var i = 0; i < length; i++) {
    var constraint = constraints[i];

    if (typeof constraint.apply(void 0, input) === 'string') {
      return false;
    }
  }

  return true;
}