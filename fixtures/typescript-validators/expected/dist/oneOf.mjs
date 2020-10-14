import UnionType from "./types/UnionType.mjs";
export default function oneOf() {
  for (var _len = arguments.length, types = new Array(_len), _key = 0; _key < _len; _key++) {
    types[_key] = arguments[_key];
  }

  return new UnionType(types);
}