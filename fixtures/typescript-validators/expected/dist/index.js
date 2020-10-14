"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["boolean"] = _boolean;
exports.number = number;
exports.string = string;
exports.symbol = symbol;
exports.simpleObject = simpleObject;
exports.allOf = allOf;
Object.defineProperty(exports, "Type", {
  enumerable: true,
  get: function get() {
    return _Type["default"];
  }
});
Object.defineProperty(exports, "AnyType", {
  enumerable: true,
  get: function get() {
    return _AnyType["default"];
  }
});
Object.defineProperty(exports, "ArrayType", {
  enumerable: true,
  get: function get() {
    return _ArrayType["default"];
  }
});
Object.defineProperty(exports, "BooleanLiteralType", {
  enumerable: true,
  get: function get() {
    return _BooleanLiteralType["default"];
  }
});
Object.defineProperty(exports, "BooleanType", {
  enumerable: true,
  get: function get() {
    return _BooleanType["default"];
  }
});
Object.defineProperty(exports, "InstanceOfType", {
  enumerable: true,
  get: function get() {
    return _InstanceOfType["default"];
  }
});
Object.defineProperty(exports, "IntersectionType", {
  enumerable: true,
  get: function get() {
    return _IntersectionType["default"];
  }
});
Object.defineProperty(exports, "NullLiteralType", {
  enumerable: true,
  get: function get() {
    return _NullLiteralType["default"];
  }
});
Object.defineProperty(exports, "UndefinedLiteralType", {
  enumerable: true,
  get: function get() {
    return _UndefinedLiteralType["default"];
  }
});
Object.defineProperty(exports, "NumberType", {
  enumerable: true,
  get: function get() {
    return _NumberType["default"];
  }
});
Object.defineProperty(exports, "NumericLiteralType", {
  enumerable: true,
  get: function get() {
    return _NumericLiteralType["default"];
  }
});
Object.defineProperty(exports, "ObjectType", {
  enumerable: true,
  get: function get() {
    return _ObjectType["default"];
  }
});
Object.defineProperty(exports, "ObjectTypeProperty", {
  enumerable: true,
  get: function get() {
    return _ObjectTypeProperty["default"];
  }
});
Object.defineProperty(exports, "RecordType", {
  enumerable: true,
  get: function get() {
    return _RecordType["default"];
  }
});
Object.defineProperty(exports, "StringLiteralType", {
  enumerable: true,
  get: function get() {
    return _StringLiteralType["default"];
  }
});
Object.defineProperty(exports, "StringType", {
  enumerable: true,
  get: function get() {
    return _StringType["default"];
  }
});
Object.defineProperty(exports, "SymbolLiteralType", {
  enumerable: true,
  get: function get() {
    return _SymbolLiteralType["default"];
  }
});
Object.defineProperty(exports, "SymbolType", {
  enumerable: true,
  get: function get() {
    return _SymbolType["default"];
  }
});
Object.defineProperty(exports, "TupleType", {
  enumerable: true,
  get: function get() {
    return _TupleType["default"];
  }
});
Object.defineProperty(exports, "UnionType", {
  enumerable: true,
  get: function get() {
    return _UnionType["default"];
  }
});
Object.defineProperty(exports, "TypeAlias", {
  enumerable: true,
  get: function get() {
    return _TypeAlias["default"];
  }
});
Object.defineProperty(exports, "TypeReference", {
  enumerable: true,
  get: function get() {
    return _TypeReference["default"];
  }
});
Object.defineProperty(exports, "Validation", {
  enumerable: true,
  get: function get() {
    return _Validation["default"];
  }
});
Object.defineProperty(exports, "RuntimeTypeError", {
  enumerable: true,
  get: function get() {
    return _RuntimeTypeError["default"];
  }
});
Object.defineProperty(exports, "oneOf", {
  enumerable: true,
  get: function get() {
    return _oneOf["default"];
  }
});
exports.ref = exports.alias = exports.tuple = exports.instanceOf = exports.record = exports.object = exports.optionalNullOr = exports.optional = exports.nullishOr = exports.nullish = exports.undefined = exports.undefinedLiteral = exports.nullOr = exports["null"] = exports.nullLiteral = exports.array = exports.any = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _Type = _interopRequireDefault(require("./types/Type.js"));

var _AnyType = _interopRequireDefault(require("./types/AnyType.js"));

var _ArrayType = _interopRequireDefault(require("./types/ArrayType.js"));

var _BooleanLiteralType = _interopRequireDefault(require("./types/BooleanLiteralType.js"));

var _BooleanType = _interopRequireDefault(require("./types/BooleanType.js"));

var _InstanceOfType = _interopRequireDefault(require("./types/InstanceOfType.js"));

var _IntersectionType = _interopRequireDefault(require("./types/IntersectionType.js"));

var _NullLiteralType = _interopRequireDefault(require("./types/NullLiteralType.js"));

var _UndefinedLiteralType = _interopRequireDefault(require("./types/UndefinedLiteralType.js"));

var _NumberType = _interopRequireDefault(require("./types/NumberType.js"));

var _NumericLiteralType = _interopRequireDefault(require("./types/NumericLiteralType.js"));

var _ObjectType = _interopRequireDefault(require("./types/ObjectType.js"));

var _ObjectTypeProperty = _interopRequireDefault(require("./types/ObjectTypeProperty.js"));

var _RecordType = _interopRequireDefault(require("./types/RecordType.js"));

var _StringLiteralType = _interopRequireDefault(require("./types/StringLiteralType.js"));

var _StringType = _interopRequireDefault(require("./types/StringType.js"));

var _SymbolLiteralType = _interopRequireDefault(require("./types/SymbolLiteralType.js"));

var _SymbolType = _interopRequireDefault(require("./types/SymbolType.js"));

var _TupleType = _interopRequireDefault(require("./types/TupleType.js"));

var _UnionType = _interopRequireDefault(require("./types/UnionType.js"));

var _TypeAlias = _interopRequireDefault(require("./types/TypeAlias.js"));

var _TypeReference = _interopRequireDefault(require("./types/TypeReference.js"));

var _Validation = _interopRequireDefault(require("./Validation.js"));

var _RuntimeTypeError = _interopRequireDefault(require("./errorReporting/RuntimeTypeError.js"));

var _oneOf = _interopRequireDefault(require("./oneOf.js"));

var any = function any() {
  return new _AnyType["default"]();
};

exports.any = any;

var array = function array(elementType) {
  return new _ArrayType["default"](elementType);
};

exports.array = array;

var nullLiteral = function nullLiteral() {
  return new _NullLiteralType["default"]();
};

exports["null"] = exports.nullLiteral = nullLiteral;

var nullOr = function nullOr(type) {
  return (0, _oneOf["default"])(type, nullLiteral());
};

exports.nullOr = nullOr;

var undefinedLiteral = function undefinedLiteral() {
  return new _UndefinedLiteralType["default"]();
};

exports.undefined = exports.undefinedLiteral = undefinedLiteral;

var nullish = function nullish(type) {
  return (0, _oneOf["default"])(type, nullLiteral(), undefinedLiteral());
};

exports.nullish = nullish;

var nullishOr = function nullishOr(type) {
  return (0, _oneOf["default"])(type, nullLiteral(), undefinedLiteral());
};

exports.nullishOr = nullishOr;

function _boolean(literal) {
  return literal != null ? new _BooleanLiteralType["default"](literal) : new _BooleanType["default"]();
}

function number(literal) {
  return literal != null ? new _NumericLiteralType["default"](literal) : new _NumberType["default"]();
}

function string(literal) {
  return literal != null ? new _StringLiteralType["default"](literal) : new _StringType["default"]();
}

function symbol(literal) {
  return literal != null ? new _SymbolLiteralType["default"](literal) : new _SymbolType["default"]();
}

var optional = function optional(type) {
  return {
    __optional__: type
  };
};

exports.optional = optional;

var getOptional = function getOptional(value) {
  return value instanceof Object ? value.__optional__ : null;
};

var optionalNullOr = function optionalNullOr(type) {
  return optional((0, _oneOf["default"])(type, nullLiteral()));
};

exports.optionalNullOr = optionalNullOr;

var object = function object() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      exact = _ref.exact;

  return function (properties) {
    return new _ObjectType["default"]((0, _toConsumableArray2["default"])(Object.entries(properties)).map(function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
          key = _ref3[0],
          type = _ref3[1];

      return new _ObjectTypeProperty["default"](key, getOptional(type) || type, Boolean(getOptional(type)));
    }), exact);
  };
};

exports.object = object;

function simpleObject(required) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      exact = _ref4.exact;

  return new _ObjectType["default"]((0, _toConsumableArray2["default"])(Object.entries(required || [])).map(function (_ref5) {
    var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
        key = _ref6[0],
        type = _ref6[1];

    return new _ObjectTypeProperty["default"](key, type, false);
  }), exact);
}

var record = function record(key, value) {
  return new _RecordType["default"](key, value);
};

exports.record = record;

var instanceOf = function instanceOf(classType) {
  return new _InstanceOfType["default"](classType);
};

exports.instanceOf = instanceOf;

var tuple = function tuple() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return new _TupleType["default"](types);
};

exports.tuple = tuple;

function allOf() {
  for (var _len2 = arguments.length, types = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    types[_key2] = arguments[_key2];
  }

  return new _IntersectionType["default"](types);
}

var alias = function alias(name, type) {
  return new _TypeAlias["default"](name, type);
};

exports.alias = alias;

var ref = function ref(type) {
  return new _TypeReference["default"](type);
};

exports.ref = ref;