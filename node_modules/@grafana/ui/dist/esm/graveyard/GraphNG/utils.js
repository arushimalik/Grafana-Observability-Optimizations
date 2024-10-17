import { outerJoinDataFrames, FieldType } from '@grafana/data';
import { AxisPlacement, ScaleDistribution, GraphDrawStyle } from '@grafana/schema';
import { FIXED_UNIT } from '../../components/uPlot/types.js';
import { applyNullInsertThreshold } from './nullInsertThreshold.js';
import { nullToUndefThreshold } from './nullToUndefThreshold.js';

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
function isVisibleBarField(f) {
  var _a, _b, _c;
  return f.type === FieldType.number && ((_a = f.config.custom) == null ? void 0 : _a.drawStyle) === GraphDrawStyle.Bars && !((_c = (_b = f.config.custom) == null ? void 0 : _b.hideFrom) == null ? void 0 : _c.viz);
}
function getRefField(frame, refFieldName) {
  return frame.fields.find((field) => {
    return refFieldName != null ? field.name === refFieldName : field.type === FieldType.time;
  });
}
function applySpanNullsThresholds(frame, refFieldName) {
  var _a;
  const refField = getRefField(frame, refFieldName);
  let refValues = refField == null ? void 0 : refField.values;
  for (let i = 0; i < frame.fields.length; i++) {
    let field = frame.fields[i];
    if (field === refField || isVisibleBarField(field)) {
      continue;
    }
    let spanNulls = (_a = field.config.custom) == null ? void 0 : _a.spanNulls;
    if (typeof spanNulls === "number") {
      if (spanNulls !== -1 && refValues) {
        field.values = nullToUndefThreshold(refValues, field.values, spanNulls);
      }
    }
  }
  return frame;
}
function preparePlotFrame(frames, dimFields, timeRange) {
  let xField;
  loop:
    for (let frame of frames) {
      for (let field of frame.fields) {
        if (dimFields.x(field, frame, frames)) {
          xField = field;
          break loop;
        }
      }
    }
  frames = frames.map((frame) => {
    var _a;
    if (!((_a = xField == null ? void 0 : xField.state) == null ? void 0 : _a.nullThresholdApplied)) {
      return applyNullInsertThreshold({
        frame,
        refFieldName: xField.name,
        refFieldPseudoMin: timeRange == null ? void 0 : timeRange.from.valueOf(),
        refFieldPseudoMax: timeRange == null ? void 0 : timeRange.to.valueOf()
      });
    } else {
      return frame;
    }
  });
  let numBarSeries = 0;
  frames.forEach((frame) => {
    frame.fields.forEach((f) => {
      if (isVisibleBarField(f)) {
        f.config.custom = __spreadProps(__spreadValues({}, f.config.custom), {
          spanNulls: -1
        });
        numBarSeries++;
      }
    });
  });
  let minXDelta = Infinity;
  if (numBarSeries > 1) {
    frames.forEach((frame) => {
      if (!frame.fields.some(isVisibleBarField)) {
        return;
      }
      const xVals = xField.values;
      for (let i = 0; i < xVals.length; i++) {
        if (i > 0) {
          minXDelta = Math.min(minXDelta, xVals[i] - xVals[i - 1]);
        }
      }
    });
  }
  let alignedFrame = outerJoinDataFrames({
    frames,
    joinBy: dimFields.x,
    keep: dimFields.y,
    keepOriginIndices: true
  });
  if (alignedFrame) {
    alignedFrame = applySpanNullsThresholds(alignedFrame, xField.name);
    if (minXDelta !== Infinity) {
      alignedFrame.fields.forEach((f, fi) => {
        let vals = f.values;
        if (fi === 0) {
          let lastVal = vals[vals.length - 1];
          vals.push(lastVal + minXDelta, lastVal + 2 * minXDelta);
        } else if (isVisibleBarField(f)) {
          vals.push(null, null);
        } else {
          vals.push(void 0, void 0);
        }
      });
      alignedFrame.length += 2;
    }
    return alignedFrame;
  }
  return null;
}
function buildScaleKey(config, fieldType) {
  var _a, _b, _c, _d, _e, _f, _g;
  const defaultPart = "na";
  const scaleRange = `${config.min !== void 0 ? config.min : defaultPart}-${config.max !== void 0 ? config.max : defaultPart}`;
  const scaleSoftRange = `${((_a = config.custom) == null ? void 0 : _a.axisSoftMin) !== void 0 ? config.custom.axisSoftMin : defaultPart}-${((_b = config.custom) == null ? void 0 : _b.axisSoftMax) !== void 0 ? config.custom.axisSoftMax : defaultPart}`;
  const scalePlacement = `${((_c = config.custom) == null ? void 0 : _c.axisPlacement) !== void 0 ? (_d = config.custom) == null ? void 0 : _d.axisPlacement : AxisPlacement.Auto}`;
  const scaleUnit = (_e = config.unit) != null ? _e : FIXED_UNIT;
  const scaleDistribution = ((_f = config.custom) == null ? void 0 : _f.scaleDistribution) ? getScaleDistributionPart(config.custom.scaleDistribution) : ScaleDistribution.Linear;
  const scaleLabel = Boolean((_g = config.custom) == null ? void 0 : _g.axisLabel) ? config.custom.axisLabel : defaultPart;
  return `${scaleUnit}/${scaleRange}/${scaleSoftRange}/${scalePlacement}/${scaleDistribution}/${scaleLabel}/${fieldType}`;
}
function getScaleDistributionPart(config) {
  if (config.type === ScaleDistribution.Log) {
    return `${config.type}${config.log}`;
  }
  return config.type;
}

export { buildScaleKey, getRefField, preparePlotFrame };
//# sourceMappingURL=utils.js.map
