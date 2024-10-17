import { isEqual } from 'lodash';

function compareDataFrameStructures(a, b, skipConfig) {
  var _a, _b;
  if (a === b) {
    return true;
  }
  if (((_a = a == null ? void 0 : a.fields) == null ? void 0 : _a.length) !== ((_b = b == null ? void 0 : b.fields) == null ? void 0 : _b.length)) {
    return false;
  }
  if (a.name !== b.name) {
    return false;
  }
  for (let i = 0; i < a.fields.length; i++) {
    const fA = a.fields[i];
    const fB = b.fields[i];
    if (fA.type !== fB.type || fA.name !== fB.name) {
      return false;
    }
    if (skipConfig) {
      continue;
    }
    if (fA.labels && fB.labels && !shallowCompare(fA.labels, fB.labels)) {
      return false;
    }
    const cfgA = fA.config;
    const cfgB = fB.config;
    if (Object.keys(cfgA).length !== Object.keys(cfgB).length) {
      return false;
    }
    let key;
    for (key in cfgA) {
      if (!(key in cfgB)) {
        return false;
      }
      if (key === "interval") {
        continue;
      }
      if (!isEqual(cfgA[key], cfgB[key])) {
        return false;
      }
    }
  }
  return true;
}
function compareArrayValues(a, b, cmp) {
  if (a === b) {
    return true;
  }
  if ((a == null ? void 0 : a.length) !== (b == null ? void 0 : b.length)) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (!cmp(a[i], b[i])) {
      return false;
    }
  }
  return true;
}
const defaultCmp = (a, b) => a === b;
function shallowCompare(a, b, cmp = defaultCmp) {
  if (a === b) {
    return true;
  }
  if (Object.keys(a).length !== Object.keys(b).length) {
    return false;
  }
  let key;
  for (key in a) {
    if (!cmp(a[key], b[key])) {
      return false;
    }
  }
  return true;
}

export { compareArrayValues, compareDataFrameStructures, shallowCompare };
//# sourceMappingURL=frameComparisons.js.map
