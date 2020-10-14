// Tracks whether we're in validation of cyclic objects.
var cyclicValidation = new WeakMap(); // Tracks whether we're toString() of cyclic objects.

var cyclicToString = new WeakSet();
export function inValidationCycle(type, input) {
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
export function startValidationCycle(type, input) {
  var tracked = cyclicValidation.get(type);

  if (!tracked) {
    tracked = new WeakSet();
    cyclicValidation.set(type, tracked);
  }

  weakSetAdd(tracked, input);
}
export function endValidationCycle(type, input) {
  var tracked = cyclicValidation.get(type);

  if (tracked) {
    weakSetDelete(tracked, input);
  }
}
export function inToStringCycle(type) {
  return cyclicToString.has(type);
}
export function startToStringCycle(type) {
  cyclicToString.add(type);
}
export function endToStringCycle(type) {
  cyclicToString["delete"](type);
}
export function weakSetHas(weakset, value) {
  try {
    return weakset.has(value);
  } catch (e) {
    return true;
  }
}
export function weakSetAdd(weakset, value) {
  try {
    weakset.add(value);
  } catch (e) {// ignore
  }
}
export function weakSetDelete(weakset, value) {
  try {
    weakset["delete"](value);
  } catch (e) {// ignore
  }
}