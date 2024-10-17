import { getRefField } from './utils.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
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
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
const INSERT_MODES = {
  threshold: (prev, next, threshold) => prev + threshold,
  midpoint: (prev, next, threshold) => (prev + next) / 2,
  // previous time + 1ms to prevent StateTimeline from forward-interpolating prior state
  plusone: (prev, next, threshold) => prev + 1
};
function applyNullInsertThreshold(opts) {
  if (opts.frame.length === 0) {
    return opts.frame;
  }
  let thorough = true;
  let { frame, refFieldName, refFieldPseudoMax, refFieldPseudoMin, insertMode } = opts;
  if (!insertMode) {
    insertMode = INSERT_MODES.threshold;
  }
  const refField = getRefField(frame, refFieldName);
  if (refField == null) {
    return frame;
  }
  refField.state = __spreadProps(__spreadValues({}, refField.state), {
    nullThresholdApplied: true
  });
  const thresholds = frame.fields.map((field) => {
    var _a;
    return ((_a = field.config.custom) == null ? void 0 : _a.insertNulls) || refField.config.interval || null;
  });
  const uniqueThresholds = new Set(thresholds);
  uniqueThresholds.delete(null);
  if (uniqueThresholds.size === 0) {
    return frame;
  }
  if (uniqueThresholds.size === 1) {
    const threshold = uniqueThresholds.values().next().value;
    if (threshold <= 0) {
      return frame;
    }
    const refValues = refField.values;
    const frameValues = frame.fields.map((field) => field.values);
    const filledFieldValues = nullInsertThreshold(
      refValues,
      frameValues,
      threshold,
      refFieldPseudoMin,
      refFieldPseudoMax,
      insertMode,
      thorough
    );
    if (filledFieldValues === frameValues) {
      return frame;
    }
    return __spreadProps(__spreadValues({}, frame), {
      length: filledFieldValues[0].length,
      fields: frame.fields.map((field, i) => __spreadProps(__spreadValues({}, field), {
        values: filledFieldValues[i]
      }))
    });
  }
  return frame;
}
function nullInsertThreshold(refValues, frameValues, threshold, refFieldPseudoMin = null, refFieldPseudoMax = null, getInsertValue, thorough) {
  const len = refValues.length;
  const refValuesNew = [];
  if (refFieldPseudoMin != null && refFieldPseudoMin < refValues[0]) {
    let preFillCount = Math.ceil((refValues[0] - refFieldPseudoMin) / threshold);
    let prevSlot = refValues[0] - preFillCount * threshold;
    while (prevSlot < refValues[0]) {
      refValuesNew.push(getInsertValue(prevSlot - threshold, prevSlot, threshold));
      prevSlot += threshold;
    }
  }
  refValuesNew.push(refValues[0]);
  let prevValue = refValues[0];
  for (let i = 1; i < len; i++) {
    const curValue = refValues[i];
    while (curValue - prevValue > threshold) {
      refValuesNew.push(getInsertValue(prevValue, curValue, threshold));
      prevValue += threshold;
      if (!thorough) {
        break;
      }
    }
    refValuesNew.push(curValue);
    prevValue = curValue;
  }
  if (refFieldPseudoMax != null && refFieldPseudoMax > prevValue) {
    while (prevValue + threshold < refFieldPseudoMax) {
      refValuesNew.push(getInsertValue(prevValue, refFieldPseudoMax, threshold));
      prevValue += threshold;
    }
  }
  const filledLen = refValuesNew.length;
  if (filledLen === len) {
    return frameValues;
  }
  const filledFieldValues = [];
  for (let fieldValues of frameValues) {
    let filledValues;
    if (fieldValues !== refValues) {
      filledValues = Array(filledLen);
      for (let i = 0, j = 0; i < filledLen; i++) {
        filledValues[i] = refValues[j] === refValuesNew[i] ? fieldValues[j++] : null;
      }
    } else {
      filledValues = refValuesNew;
    }
    filledFieldValues.push(filledValues);
  }
  return filledFieldValues;
}

export { applyNullInsertThreshold };
//# sourceMappingURL=nullInsertThreshold.js.map
