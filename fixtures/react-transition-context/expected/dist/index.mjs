function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/**
 * 
 * @prettier
 */
import * as React from "react";
import { useContext, useEffect, useRef } from "react";
var bpfrpt_proptype_TransitionState = PropTypes.oneOf(["out", "in", "appearing", "entering", "leaving"]);
var BaseTransitionContext = /*#__PURE__*/React.createContext('in');
export function useTransitionContext() {
  return useContext(BaseTransitionContext);
}
var priority = ['out', 'leaving', 'appearing', 'entering'];
export function overallTransitionState(parentState, childState) {
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
  "state": PropTypes.oneOf(["out", "in", "appearing", "entering", "leaving"]).isRequired,
  "children": PropTypes.node.isRequired
};
export function TransitionContext(_ref) {
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

var bpfrpt_proptype_TransitionStateEffect = PropTypes.func;
export function useTransitionStateEffect(effect) {
  var nextState = useTransitionContext();
  var prevStateRef = useRef(null);
  var effectRef = useRef(effect);
  effectRef.current = effect;
  useEffect(function () {
    var prevState = prevStateRef.current;
    var effect = effectRef.current;
    prevStateRef.current = nextState;
    effect(prevState, nextState);
  }, [nextState]);
  useEffect(function () {
    return function () {
      var effect = effectRef.current;
      if (!outish(nextState)) effect(nextState, 'leaving');
    };
  }, []);
}
export function useTransitionStateEffectFilter(filter) {
  return function (effect) {
    return useTransitionStateEffect(function (prevState, nextState) {
      if (filter(prevState, nextState)) effect(prevState, nextState);
    });
  };
}
export var useAppearingEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return outish(prevState || 'out') && nextState === 'appearing';
});
export var useEnteringEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return outish(prevState || 'out') && nextState === 'entering';
});
export var useAppearedEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return prevState === 'appearing' && nextState === 'in';
});
export var useEnteredEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return prevState === 'entering' && nextState === 'in';
});
export var useCameInEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return nextState === 'in';
});
export var useLeavingEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return !outish(prevState || 'out') && nextState === 'leaving';
});
export var useLeftEffect = useTransitionStateEffectFilter(function (prevState, nextState) {
  return prevState === 'leaving' && nextState === 'out';
});
export function useAutofocusRef() {
  var ref = useRef();
  useCameInEffect(function () {
    var el = ref.current;

    if (el) {
      el.focus();
      if (typeof el.select === 'function') el.select();
    }
  });
  return ref;
}
import PropTypes from "prop-types";
export { bpfrpt_proptype_TransitionState };
export { bpfrpt_proptype_Props };
export { bpfrpt_proptype_TransitionStateEffect };