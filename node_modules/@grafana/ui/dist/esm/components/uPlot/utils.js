import { reduceField, fieldReducers, ReducerID, getDisplayProcessor, FieldType, ensureTimeField } from '@grafana/data';
import { StackingMode, GraphDrawStyle, GraphTransform } from '@grafana/schema';
import '../../utils/dom.js';
import 'react';
import '../../utils/colors.js';
import 'slate';
import 'lodash';
import 'ansicolor';
import { createLogger } from '../../utils/logger.js';
import { attachDebugger } from '../../utils/debug.js';
import { buildScaleKey } from './internal.js';

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
const paddingSide = (u, side, sidesWithAxes) => {
  let hasCrossAxis = side % 2 ? sidesWithAxes[0] || sidesWithAxes[2] : sidesWithAxes[1] || sidesWithAxes[3];
  return sidesWithAxes[side] || !hasCrossAxis ? 0 : 8;
};
const DEFAULT_PLOT_CONFIG = {
  ms: 1,
  focus: {
    alpha: 1
  },
  cursor: {
    focus: {
      prox: 30
    }
  },
  legend: {
    show: false
  },
  padding: [paddingSide, paddingSide, paddingSide, paddingSide],
  series: [],
  hooks: {}
};
function getStackingBands(group) {
  let bands = [];
  let { series, dir } = group;
  let lastIdx = series.length - 1;
  let rSeries = series.slice().reverse();
  rSeries.forEach((si, i) => {
    if (i !== lastIdx) {
      let nextIdx = rSeries[i + 1];
      bands.push({
        series: [si, nextIdx],
        // fill direction is inverted from stack direction
        dir: -1 * dir
      });
    }
  });
  return bands;
}
function getStackingGroups(frame) {
  let groups = /* @__PURE__ */ new Map();
  frame.fields.forEach(({ config, values, type }, i) => {
    var _a;
    if (i === 0) {
      return;
    }
    let { custom } = config;
    if (custom == null) {
      return;
    }
    if ((_a = custom.hideFrom) == null ? void 0 : _a.viz) {
      return;
    }
    let { stacking } = custom;
    if (stacking == null) {
      return;
    }
    let { mode: stackingMode, group: stackingGroup } = stacking;
    if (stackingMode === StackingMode.None) {
      return;
    }
    let transform = custom.transform;
    let stackDir = getStackDirection(transform, values);
    let drawStyle = custom.drawStyle;
    let drawStyle2 = drawStyle === GraphDrawStyle.Bars ? custom.barAlignment : drawStyle === GraphDrawStyle.Line ? custom.lineInterpolation : null;
    let stackKey = `${stackDir}|${stackingMode}|${stackingGroup}|${buildScaleKey(
      config,
      type
    )}|${drawStyle}|${drawStyle2}`;
    let group = groups.get(stackKey);
    if (group == null) {
      group = {
        series: [],
        dir: stackDir
      };
      groups.set(stackKey, group);
    }
    group.series.push(i);
  });
  return [...groups.values()];
}
function preparePlotData2(frame, stackingGroups, onStackMeta) {
  let data = Array(frame.fields.length);
  let stacksQty = stackingGroups.length;
  let dataLen = frame.length;
  let zeroArr = stacksQty > 0 ? Array(dataLen).fill(0) : [];
  let falseArr = stacksQty > 0 ? Array(dataLen).fill(false) : [];
  let accums = Array.from({ length: stacksQty }, () => zeroArr.slice());
  let anyValsAtX = Array.from({ length: stacksQty }, () => falseArr.slice());
  stackingGroups.forEach((group, groupIdx) => {
    let groupValsAtX = anyValsAtX[groupIdx];
    group.series.forEach((seriesIdx) => {
      var _a, _b;
      let field = frame.fields[seriesIdx];
      if ((_b = (_a = field.config.custom) == null ? void 0 : _a.hideFrom) == null ? void 0 : _b.viz) {
        return;
      }
      let vals = field.values;
      for (let i = 0; i < dataLen; i++) {
        if (vals[i] != null) {
          groupValsAtX[i] = true;
        }
      }
    });
  });
  frame.fields.forEach((field, i) => {
    var _a, _b;
    let vals = field.values;
    if (i === 0) {
      if (field.type === FieldType.time) {
        data[0] = ensureTimeField(field).values;
      } else {
        data[0] = vals;
      }
      return;
    }
    let { custom } = field.config;
    if (!custom || ((_a = custom.hideFrom) == null ? void 0 : _a.viz)) {
      data[i] = vals;
      return;
    }
    if (custom.transform === GraphTransform.Constant) {
      let firstValIdx = vals.findIndex((v) => v != null);
      let firstVal = vals[firstValIdx];
      vals = Array(vals.length).fill(void 0);
      vals[firstValIdx] = firstVal;
    } else {
      vals = vals.slice();
      if (custom.transform === GraphTransform.NegativeY) {
        for (let i2 = 0; i2 < vals.length; i2++) {
          if (vals[i2] != null) {
            vals[i2] *= -1;
          }
        }
      }
    }
    let stackingMode = (_b = custom.stacking) == null ? void 0 : _b.mode;
    if (!stackingMode || stackingMode === StackingMode.None) {
      data[i] = vals;
    } else {
      let stackIdx = stackingGroups.findIndex((group) => group.series.indexOf(i) > -1);
      let accum = accums[stackIdx];
      let groupValsAtX = anyValsAtX[stackIdx];
      let stacked = data[i] = Array(dataLen);
      for (let i2 = 0; i2 < dataLen; i2++) {
        let v = vals[i2];
        if (v != null) {
          stacked[i2] = accum[i2] += v;
        } else {
          stacked[i2] = groupValsAtX[i2] ? accum[i2] : v;
        }
      }
    }
  });
  if (onStackMeta) {
    let accumsBySeriesIdx = data.map((vals, i) => {
      let stackIdx = stackingGroups.findIndex((group) => group.series.indexOf(i) > -1);
      return stackIdx !== -1 ? accums[stackIdx] : vals;
    });
    onStackMeta({
      totals: accumsBySeriesIdx
    });
  }
  frame.fields.forEach((field, i) => {
    var _a, _b, _c, _d;
    if (i === 0 || ((_b = (_a = field.config.custom) == null ? void 0 : _a.hideFrom) == null ? void 0 : _b.viz)) {
      return;
    }
    let stackingMode = (_d = (_c = field.config.custom) == null ? void 0 : _c.stacking) == null ? void 0 : _d.mode;
    if (stackingMode === StackingMode.Percent) {
      let stackIdx = stackingGroups.findIndex((group2) => group2.series.indexOf(i) > -1);
      let accum = accums[stackIdx];
      let group = stackingGroups[stackIdx];
      let stacked = data[i];
      for (let i2 = 0; i2 < dataLen; i2++) {
        let v = stacked[i2];
        if (v != null) {
          stacked[i2] = accum[i2] === 0 ? 0 : group.dir * (v / accum[i2]);
        }
      }
    }
  });
  return data;
}
function findMidPointYPosition(u, idx) {
  let y;
  let sMaxIdx = 1;
  let sMinIdx = 1;
  let max = u.data[1][idx];
  let min = u.data[1][idx];
  for (let i = 1; i < u.data.length; i++) {
    const sData = u.data[i];
    const sVal = sData[idx];
    if (sVal != null) {
      if (max == null) {
        max = sVal;
      } else {
        if (sVal > max) {
          max = u.data[i][idx];
          sMaxIdx = i;
        }
      }
      if (min == null) {
        min = sVal;
      } else {
        if (sVal < min) {
          min = u.data[i][idx];
          sMinIdx = i;
        }
      }
    }
  }
  if (min == null && max == null) {
    y = void 0;
  } else if (min != null && max != null) {
    y = (u.valToPos(min, u.series[sMinIdx].scale) + u.valToPos(max, u.series[sMaxIdx].scale)) / 2;
  } else {
    y = u.valToPos(min || max, u.series[sMaxIdx || sMinIdx].scale);
  }
  if (y !== void 0 && y < 0) {
    y = u.bbox.height / devicePixelRatio;
  }
  return y;
}
function getStackDirection(transform, data) {
  const hasNegSamp = hasNegSample(data);
  if (transform === GraphTransform.NegativeY) {
    return hasNegSamp ? 1 /* Pos */ : -1 /* Neg */;
  }
  return hasNegSamp ? -1 /* Neg */ : 1 /* Pos */;
}
function hasNegSample(data, samples = 100) {
  const len = data.length;
  if (len === 0) {
    return false;
  }
  let firstIdx = 0;
  let lastIdx = len - 1;
  while (firstIdx <= lastIdx && data[firstIdx] == null) {
    firstIdx++;
  }
  while (lastIdx >= firstIdx && data[lastIdx] == null) {
    lastIdx--;
  }
  let negCount = 0;
  let posCount = 0;
  if (lastIdx >= firstIdx) {
    const stride = Math.max(1, Math.floor((lastIdx - firstIdx + 1) / samples));
    for (let i = firstIdx; i <= lastIdx; i += stride) {
      const v = data[i];
      if (v != null && typeof v === "number") {
        if (v < 0 || Object.is(v, -0)) {
          negCount++;
        } else if (v > 0) {
          posCount++;
        }
      }
    }
    if (negCount > posCount) {
      return true;
    }
  }
  return false;
}
const getDisplayValuesForCalcs = (calcs, field, theme) => {
  var _a;
  if (!(calcs == null ? void 0 : calcs.length)) {
    return [];
  }
  const defaultFormatter = (v) => v == null ? "-" : v.toFixed(1);
  const fmt = (_a = field.display) != null ? _a : defaultFormatter;
  let countFormatter = null;
  const fieldCalcs = reduceField({
    field,
    reducers: calcs
  });
  return calcs.map((reducerId) => {
    const fieldReducer = fieldReducers.get(reducerId);
    let formatter = fmt;
    if (fieldReducer.id === ReducerID.diffperc) {
      formatter = getDisplayProcessor({
        field: __spreadProps(__spreadValues({}, field), {
          config: __spreadProps(__spreadValues({}, field.config), {
            unit: "percent"
          })
        }),
        theme
      });
    }
    if (fieldReducer.id === ReducerID.count || fieldReducer.id === ReducerID.changeCount || fieldReducer.id === ReducerID.distinctCount) {
      if (!countFormatter) {
        countFormatter = getDisplayProcessor({
          field: __spreadProps(__spreadValues({}, field), {
            config: __spreadProps(__spreadValues({}, field.config), {
              unit: "none"
            })
          }),
          theme
        });
      }
      formatter = countFormatter;
    }
    return __spreadProps(__spreadValues({}, formatter(fieldCalcs[reducerId])), {
      title: fieldReducer.name,
      description: fieldReducer.description
    });
  });
};
const pluginLogger = createLogger("uPlot");
const pluginLog = pluginLogger.logger;
attachDebugger("graphng", void 0, pluginLogger);

export { DEFAULT_PLOT_CONFIG, findMidPointYPosition, getDisplayValuesForCalcs, getStackingBands, getStackingGroups, pluginLog, pluginLogger, preparePlotData2 };
//# sourceMappingURL=utils.js.map
