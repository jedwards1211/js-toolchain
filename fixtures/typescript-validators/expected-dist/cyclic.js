"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inValidationCycle = inValidationCycle;
exports.startValidationCycle = startValidationCycle;
exports.endValidationCycle = endValidationCycle;
exports.inToStringCycle = inToStringCycle;
exports.startToStringCycle = startToStringCycle;
exports.endToStringCycle = endToStringCycle;
exports.weakSetHas = weakSetHas;
exports.weakSetAdd = weakSetAdd;
exports.weakSetDelete = weakSetDelete;
// Tracks whether we're in validation of cyclic objects.
var cyclicValidation = new WeakMap(); // Tracks whether we're toString() of cyclic objects.

var cyclicToString = new WeakSet();

function inValidationCycle(type, input) {
  try {
    var tracked = cyclicValidation.get(type);

    if (!tracked) {
      return false;
    } else {
      return weakSetHas(tracked, input);
    }
  } catch (e) {
    // some exotic values cannot be checked
    return true;
  }
}

function startValidationCycle(type, input) {
  var tracked = cyclicValidation.get(type);

  if (!tracked) {
    tracked = new WeakSet();
    cyclicValidation.set(type, tracked);
  }

  weakSetAdd(tracked, input);
}

function endValidationCycle(type, input) {
  var tracked = cyclicValidation.get(type);

  if (tracked) {
    weakSetDelete(tracked, input);
  }
}

function inToStringCycle(type) {
  return cyclicToString.has(type);
}

function startToStringCycle(type) {
  cyclicToString.add(type);
}

function endToStringCycle(type) {
  cyclicToString["delete"](type);
}

function weakSetHas(weakset, value) {
  try {
    return weakset.has(value);
  } catch (e) {
    return true;
  }
}

function weakSetAdd(weakset, value) {
  try {
    weakset.add(value);
  } catch (e) {// ignore
  }
}

function weakSetDelete(weakset, value) {
  try {
    weakset["delete"](value);
  } catch (e) {// ignore
  }
}