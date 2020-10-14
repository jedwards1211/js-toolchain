import updateIn from "./updateIn.mjs";

function setIn(obj, path, newValue) {
  return updateIn(obj, path, function () {
    return newValue;
  });
}

export default setIn;