import _slicedToArray from "@babel/runtime/helpers/slicedToArray";
import _toConsumableArray from "@babel/runtime/helpers/toConsumableArray";
import Type from "./types/Type.mjs";
import AnyType from "./types/AnyType.mjs";
import ArrayType from "./types/ArrayType.mjs";
import BooleanLiteralType from "./types/BooleanLiteralType.mjs";
import BooleanType from "./types/BooleanType.mjs";
import InstanceOfType from "./types/InstanceOfType.mjs";
import IntersectionType from "./types/IntersectionType.mjs";
import NullLiteralType from "./types/NullLiteralType.mjs";
import UndefinedLiteralType from "./types/UndefinedLiteralType.mjs";
import NumberType from "./types/NumberType.mjs";
import NumericLiteralType from "./types/NumericLiteralType.mjs";
import ObjectType from "./types/ObjectType.mjs";
import ObjectTypeProperty from "./types/ObjectTypeProperty.mjs";
import RecordType from "./types/RecordType.mjs";
import StringLiteralType from "./types/StringLiteralType.mjs";
import StringType from "./types/StringType.mjs";
import SymbolLiteralType from "./types/SymbolLiteralType.mjs";
import SymbolType from "./types/SymbolType.mjs";
import TupleType from "./types/TupleType.mjs";
import UnionType from "./types/UnionType.mjs";
import TypeAlias from "./types/TypeAlias.mjs";
import TypeReference from "./types/TypeReference.mjs";
import Validation from "./Validation.mjs";
import RuntimeTypeError from "./errorReporting/RuntimeTypeError.mjs";
import oneOf from "./oneOf.mjs";
export { Type, AnyType, ArrayType, BooleanLiteralType, BooleanType, InstanceOfType, IntersectionType, NullLiteralType, UndefinedLiteralType, NumberType, NumericLiteralType, ObjectType, ObjectTypeProperty, RecordType, StringLiteralType, StringType, SymbolLiteralType, SymbolType, TupleType, UnionType, TypeAlias, TypeReference, Validation, RuntimeTypeError, oneOf };
export var any = function any() {
  return new AnyType();
};
export var array = function array(elementType) {
  return new ArrayType(elementType);
};
export var nullLiteral = function nullLiteral() {
  return new NullLiteralType();
};
export { nullLiteral as null };
export var nullOr = function nullOr(type) {
  return oneOf(type, nullLiteral());
};
export var undefinedLiteral = function undefinedLiteral() {
  return new UndefinedLiteralType();
};
export { undefinedLiteral as undefined };
export var nullish = function nullish(type) {
  return oneOf(type, nullLiteral(), undefinedLiteral());
};
export var nullishOr = function nullishOr(type) {
  return oneOf(type, nullLiteral(), undefinedLiteral());
};

function _boolean(literal) {
  return literal != null ? new BooleanLiteralType(literal) : new BooleanType();
}

export { _boolean as boolean };
export function number(literal) {
  return literal != null ? new NumericLiteralType(literal) : new NumberType();
}
export function string(literal) {
  return literal != null ? new StringLiteralType(literal) : new StringType();
}
export function symbol(literal) {
  return literal != null ? new SymbolLiteralType(literal) : new SymbolType();
}
export var optional = function optional(type) {
  return {
    __optional__: type
  };
};

var getOptional = function getOptional(value) {
  return value instanceof Object ? value.__optional__ : null;
};

export var optionalNullOr = function optionalNullOr(type) {
  return optional(oneOf(type, nullLiteral()));
};
export var object = function object() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      exact = _ref.exact;

  return function (properties) {
    return new ObjectType(_toConsumableArray(Object.entries(properties)).map(function (_ref2) {
      var _ref3 = _slicedToArray(_ref2, 2),
          key = _ref3[0],
          type = _ref3[1];

      return new ObjectTypeProperty(key, getOptional(type) || type, Boolean(getOptional(type)));
    }), exact);
  };
};
export function simpleObject(required) {
  var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      exact = _ref4.exact;

  return new ObjectType(_toConsumableArray(Object.entries(required || [])).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        type = _ref6[1];

    return new ObjectTypeProperty(key, type, false);
  }), exact);
}
export var record = function record(key, value) {
  return new RecordType(key, value);
};
export var instanceOf = function instanceOf(classType) {
  return new InstanceOfType(classType);
};
export var tuple = function tuple() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return new TupleType(types);
};
export function allOf() {
  for (var _len2 = arguments.length, types = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    types[_key2] = arguments[_key2];
  }

  return new IntersectionType(types);
}
export var alias = function alias(name, type) {
  return new TypeAlias(name, type);
};
export var ref = function ref(type) {
  return new TypeReference(type);
};