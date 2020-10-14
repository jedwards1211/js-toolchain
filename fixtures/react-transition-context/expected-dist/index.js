"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useTransitionContext = useTransitionContext;
exports.overallTransitionState = overallTransitionState;
exports.TransitionContext = TransitionContext;
exports.useTransitionStateEffect = useTransitionStateEffect;
exports.useTransitionStateEffectFilter = useTransitionStateEffectFilter;
exports.useAutofocusRef = useAutofocusRef;
exports.bpfrpt_proptype_TransitionStateEffect = exports.bpfrpt_proptype_Props = exports.bpfrpt_proptype_TransitionState = exports.useLeftEffect = exports.useLeavingEffect = exports.useCameInEffect = exports.useEnteredEffect = exports.useAppearedEffect = exports.useEnteringEffect = exports.useAppearingEffect = void 0;

var React = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var bpfrpt_proptype_TransitionState = _propTypes["default"].oneOf(["out", "in", "appearing", "entering", "leaving"]);

exports.bpfrpt_proptype_TransitionState = bpfrpt_proptype_TransitionState;
var BaseTransitionContext = /*#__PURE__*/React.createContext('in');

function useTransitionContext() {
  return (0, React.useContext)(BaseTransitionContext);
}

var priority = ['out', 'leaving', 'appearing', 'entering'];

function overallTransitionState(parentState, childState) {
  var _iterator = _createForOfIteratorHelper(priority),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var state = _step.value;
      if (parentState === state || childState === state) return state;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return childState;
}

var bpfrpt_proptype_Props = {
  "state": _propTypes["default"].oneOf(["out", "in", "appearing", "entering", "leaving"]).isRequired,
  "children": _propTypes["default"].node.isRequired
};
exports.bpfrpt_proptype_Props = bpfrpt_proptype_Props;

function TransitionContext(_ref) {
  var state = _ref.state,
      children = _ref.children;
  var parentState = useTransitionContext();
  var overallState = overallTransitionState(parentState, state);
  return /*#__PURE__*/React.createElement(BaseTransitionContext.Provider, {
    value: overallState
  }, children);
}

TransitionContext.propTypes = bpfrpt_proptype_Props;

function outish(state) {
  return state === 'out' || state === 'leaving';
}

var bpfrpt_proptype_TransitionStateEffect = _propTypes["default"].func;
exports.bpfrpt_proptype_TransitionStateEffect = bpfrpt_proptype_TransitionStateEffect;

function useTransitionStateEffect(effect) {
  var nextState = useTransitionContext();
  var prevStateRef = (0, React.useRef)(null);
  var effectRef = (0, React.useRef)(effect);
  effectRef.current = effect;
  (0, React.useEffect)(function () {
    var prevState = prevStateRef.current;
    var effect = effectRef.current;
    prevStateRef.current = nextState;
    effect(prevState, nextState);
  }, [nextState]);
  (0, React.useEffect)(function () {
    return function () {
      var effect = effectRef.current;
      if (!outish(nextState)) effect(nextState, 'leaving');
    };
  }, []);
}

function useTransitionStateEffectFilter(filter) {
  return function (effect) {
    return useTransitionStateEffect(function (prevState, nextState) {
      if (filter(prevState, nextState)) effect(prevState, nextState);
    });
  };
}

var useAppearingEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return outish(prevState || 'out') && nextState === 'appearing';
});
exports.useAppearingEffect = useAppearingEffect;
var useEnteringEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return outish(prevState || 'out') && nextState === 'entering';
});
exports.useEnteringEffect = useEnteringEffect;
var useAppearedEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return prevState === 'appearing' && nextState === 'in';
});
exports.useAppearedEffect = useAppearedEffect;
var useEnteredEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return prevState === 'entering' && nextState === 'in';
});
exports.useEnteredEffect = useEnteredEffect;
var useCameInEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return nextState === 'in';
});
exports.useCameInEffect = useCameInEffect;
var useLeavingEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return !outish(prevState || 'out') && nextState === 'leaving';
});
exports.useLeavingEffect = useLeavingEffect;
var useLeftEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return prevState === 'leaving' && nextState === 'out';
});
exports.useLeftEffect = useLeftEffect;

function useAutofocusRef() {
  var ref = (0, React.useRef)();
  useCameInEffect(function () {
    var el = ref.current;

    if (el) {
      el.focus();
      if (typeof el.select === 'function') el.select();
    }
  });
  return ref;
}