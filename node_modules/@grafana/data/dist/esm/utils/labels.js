var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const labelRegexp = /\b(\w+)(!?=~?)"([^"\n]*?)"/g;
function parseLabels(labels) {
  const labelsByKey = {};
  labels.replace(labelRegexp, (_, key, operator, value) => {
    labelsByKey[key] = value;
    return "";
  });
  return labelsByKey;
}
function findCommonLabels(labelsSets) {
  return labelsSets.reduce(
    (acc, labels) => {
      if (!labels) {
        throw new Error("Need parsed labels to find common labels.");
      }
      Object.keys(labels).forEach((key) => {
        if (acc[key] === void 0 || acc[key] !== labels[key]) {
          delete acc[key];
        }
      });
      Object.keys(acc).forEach((key) => {
        if (labels[key] === void 0) {
          delete acc[key];
        }
      });
      return acc;
    },
    __spreadValues({}, labelsSets[0])
  );
}
function findUniqueLabels(labels, commonLabels) {
  const uncommonLabels = __spreadValues({}, labels);
  Object.keys(commonLabels).forEach((key) => {
    delete uncommonLabels[key];
  });
  return uncommonLabels;
}
function matchAllLabels(expect, against) {
  if (!expect) {
    return true;
  }
  for (const [key, value] of Object.entries(expect)) {
    if (!against || against[key] !== value) {
      return false;
    }
  }
  return true;
}
function formatLabels(labels, defaultValue = "", withoutBraces) {
  if (!labels || Object.keys(labels).length === 0) {
    return defaultValue;
  }
  const labelKeys = Object.keys(labels).sort();
  const cleanSelector = labelKeys.map((key) => `${key}="${labels[key]}"`).join(", ");
  if (withoutBraces) {
    return cleanSelector;
  }
  return ["{", cleanSelector, "}"].join("");
}

export { findCommonLabels, findUniqueLabels, formatLabels, matchAllLabels, parseLabels };
//# sourceMappingURL=labels.js.map
