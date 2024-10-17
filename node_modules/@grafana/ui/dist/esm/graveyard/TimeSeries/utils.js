import { isNumber } from 'lodash';
import uPlot from 'uplot';
import { FieldType, formattedValueToString, getDisplayProcessor, getFieldColorModeForField, getFieldSeriesColor, FieldColorModeId, getFieldDisplayName, DashboardCursorSync } from '@grafana/data';
import { GraphDrawStyle, VisibilityMode, AxisPlacement, ScaleOrientation, ScaleDirection, StackingMode, AxisColorMode, GraphGradientMode, GraphTransform, GraphThresholdsStyleMode } from '@grafana/schema';
import { UPlotConfigBuilder } from '../../components/uPlot/config/UPlotConfigBuilder.js';
import { getScaleGradientFn } from '../../components/uPlot/config/gradientFills.js';
import { preparePlotData2, getStackingGroups } from '../../components/uPlot/utils.js';
import { buildScaleKey } from '../GraphNG/utils.js';

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
const IEC_UNITS = /* @__PURE__ */ new Set([
  "bytes",
  "bits",
  "kbytes",
  "mbytes",
  "gbytes",
  "tbytes",
  "pbytes",
  "binBps",
  "binbps",
  "KiBs",
  "Kibits",
  "MiBs",
  "Mibits",
  "GiBs",
  "Gibits",
  "TiBs",
  "Tibits",
  "PiBs",
  "Pibits"
]);
const BIN_INCRS = Array(53);
for (let i = 0; i < BIN_INCRS.length; i++) {
  BIN_INCRS[i] = 2 ** i;
}
const defaultFormatter = (v, decimals = 1) => v == null ? "-" : v.toFixed(decimals);
const defaultConfig = {
  drawStyle: GraphDrawStyle.Line,
  showPoints: VisibilityMode.Auto,
  axisPlacement: AxisPlacement.Auto
};
const preparePlotConfigBuilder = ({
  frame,
  theme,
  timeZones,
  getTimeRange,
  sync,
  allFrames,
  renderers,
  tweakScale = (opts) => opts,
  tweakAxis = (opts) => opts
}) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v;
  const eventsScope = "__global_";
  const builder = new UPlotConfigBuilder(timeZones[0]);
  let alignedFrame;
  builder.setPrepData((frames) => {
    alignedFrame = frames[0];
    return preparePlotData2(frames[0], builder.getStackingGroups());
  });
  const xField = frame.fields[0];
  if (!xField) {
    return builder;
  }
  const xScaleKey = "x";
  let yScaleKey = "";
  const xFieldAxisPlacement = ((_a = xField.config.custom) == null ? void 0 : _a.axisPlacement) !== AxisPlacement.Hidden ? AxisPlacement.Bottom : AxisPlacement.Hidden;
  const xFieldAxisShow = ((_b = xField.config.custom) == null ? void 0 : _b.axisPlacement) !== AxisPlacement.Hidden;
  if (xField.type === FieldType.time) {
    builder.addScale({
      scaleKey: xScaleKey,
      orientation: ScaleOrientation.Horizontal,
      direction: ScaleDirection.Right,
      isTime: true,
      range: () => {
        const r = getTimeRange();
        return [r.from.valueOf(), r.to.valueOf()];
      }
    });
    const filterTicks = timeZones.length > 1 ? (u, splits) => {
      return splits.map((v, i) => i < 2 ? null : v);
    } : void 0;
    for (let i = 0; i < timeZones.length; i++) {
      const timeZone = timeZones[i];
      builder.addAxis({
        scaleKey: xScaleKey,
        isTime: true,
        placement: xFieldAxisPlacement,
        show: xFieldAxisShow,
        label: (_c = xField.config.custom) == null ? void 0 : _c.axisLabel,
        timeZone,
        theme,
        grid: { show: i === 0 && ((_d = xField.config.custom) == null ? void 0 : _d.axisGridShow) },
        filter: filterTicks
      });
    }
    if (timeZones.length > 1) {
      builder.addHook("drawAxes", (u) => {
        u.ctx.save();
        u.ctx.fillStyle = theme.colors.text.primary;
        u.ctx.textAlign = "left";
        u.ctx.textBaseline = "bottom";
        let i = 0;
        u.axes.forEach((a) => {
          if (a.side === 2) {
            let cssBaseline = a._pos + a._size;
            u.ctx.fillText(timeZones[i], u.bbox.left, cssBaseline * uPlot.pxRatio);
            i++;
          }
        });
        u.ctx.restore();
      });
    }
  } else {
    builder.addScale({
      scaleKey: xScaleKey,
      orientation: ScaleOrientation.Horizontal,
      direction: ScaleDirection.Right,
      range: (u, dataMin, dataMax) => {
        var _a2, _b2;
        return [(_a2 = xField.config.min) != null ? _a2 : dataMin, (_b2 = xField.config.max) != null ? _b2 : dataMax];
      }
    });
    builder.addAxis({
      scaleKey: xScaleKey,
      placement: xFieldAxisPlacement,
      show: xFieldAxisShow,
      label: (_e = xField.config.custom) == null ? void 0 : _e.axisLabel,
      theme,
      grid: { show: (_f = xField.config.custom) == null ? void 0 : _f.axisGridShow },
      formatValue: (v, decimals) => formattedValueToString(xField.display(v, decimals))
    });
  }
  let customRenderedFields = (_g = renderers == null ? void 0 : renderers.flatMap((r) => Object.values(r.fieldMap).filter((name) => r.indicesOnly.indexOf(name) === -1))) != null ? _g : [];
  let indexByName;
  for (let i = 1; i < frame.fields.length; i++) {
    const field = frame.fields[i];
    const config = __spreadProps(__spreadValues({}, field.config), {
      custom: __spreadValues(__spreadValues({}, defaultConfig), field.config.custom)
    });
    const customConfig = config.custom;
    if (field === xField || field.type !== FieldType.number && field.type !== FieldType.enum) {
      continue;
    }
    let fmt = (_h = field.display) != null ? _h : defaultFormatter;
    if (((_j = (_i = field.config.custom) == null ? void 0 : _i.stacking) == null ? void 0 : _j.mode) === StackingMode.Percent) {
      fmt = getDisplayProcessor({
        field: __spreadProps(__spreadValues({}, field), {
          config: __spreadProps(__spreadValues({}, field.config), {
            unit: "percentunit"
          })
        }),
        theme
      });
    }
    const scaleKey = buildScaleKey(config, field.type);
    const colorMode = getFieldColorModeForField(field);
    const scaleColor = getFieldSeriesColor(field, theme);
    const seriesColor = scaleColor.color;
    builder.addScale(
      tweakScale(
        {
          scaleKey,
          orientation: ScaleOrientation.Vertical,
          direction: ScaleDirection.Up,
          distribution: (_k = customConfig.scaleDistribution) == null ? void 0 : _k.type,
          log: (_l = customConfig.scaleDistribution) == null ? void 0 : _l.log,
          linearThreshold: (_m = customConfig.scaleDistribution) == null ? void 0 : _m.linearThreshold,
          min: field.config.min,
          max: field.config.max,
          softMin: customConfig.axisSoftMin,
          softMax: customConfig.axisSoftMax,
          centeredZero: customConfig.axisCenteredZero,
          range: ((_n = customConfig.stacking) == null ? void 0 : _n.mode) === StackingMode.Percent ? (u, dataMin, dataMax) => {
            dataMin = dataMin < 0 ? -1 : 0;
            dataMax = dataMax > 0 ? 1 : 0;
            return [dataMin, dataMax];
          } : field.type === FieldType.enum ? (u, dataMin, dataMax) => {
            let len = field.config.type.enum.text.length;
            return [-1, len];
          } : void 0,
          decimals: field.config.decimals
        },
        field
      )
    );
    if (!yScaleKey) {
      yScaleKey = scaleKey;
    }
    if (customConfig.axisPlacement !== AxisPlacement.Hidden) {
      let axisColor;
      if (customConfig.axisColorMode === AxisColorMode.Series) {
        if (colorMode.isByValue && ((_o = field.config.custom) == null ? void 0 : _o.gradientMode) === GraphGradientMode.Scheme && colorMode.id === FieldColorModeId.Thresholds) {
          axisColor = getScaleGradientFn(1, theme, colorMode, field.config.thresholds);
        } else {
          axisColor = seriesColor;
        }
      }
      const axisDisplayOptions = {
        border: {
          show: customConfig.axisBorderShow || false,
          width: 1 / devicePixelRatio,
          stroke: axisColor || theme.colors.text.primary
        },
        ticks: {
          show: customConfig.axisBorderShow || false,
          stroke: axisColor || theme.colors.text.primary
        },
        color: axisColor || theme.colors.text.primary
      };
      let incrs;
      let values;
      let splits;
      if (IEC_UNITS.has(config.unit)) {
        incrs = BIN_INCRS;
      } else if (field.type === FieldType.enum) {
        let text = field.config.type.enum.text;
        splits = text.map((v, i2) => i2);
        values = text;
      }
      builder.addAxis(
        tweakAxis(
          __spreadValues({
            scaleKey,
            label: customConfig.axisLabel,
            size: customConfig.axisWidth,
            placement: (_p = customConfig.axisPlacement) != null ? _p : AxisPlacement.Auto,
            formatValue: (v, decimals) => formattedValueToString(fmt(v, decimals)),
            theme,
            grid: { show: customConfig.axisGridShow },
            decimals: field.config.decimals,
            distr: (_q = customConfig.scaleDistribution) == null ? void 0 : _q.type,
            splits,
            values,
            incrs
          }, axisDisplayOptions),
          field
        )
      );
    }
    const showPoints = customConfig.drawStyle === GraphDrawStyle.Points ? VisibilityMode.Always : customConfig.showPoints;
    let pointsFilter = () => null;
    if (customConfig.spanNulls !== true) {
      pointsFilter = (u, seriesIdx, show, gaps) => {
        let filtered = [];
        let series = u.series[seriesIdx];
        if (!show && gaps && gaps.length) {
          const [firstIdx, lastIdx] = series.idxs;
          const xData = u.data[0];
          const yData = u.data[seriesIdx];
          const firstPos = Math.round(u.valToPos(xData[firstIdx], "x", true));
          const lastPos = Math.round(u.valToPos(xData[lastIdx], "x", true));
          if (gaps[0][0] === firstPos) {
            filtered.push(firstIdx);
          }
          for (let i2 = 0; i2 < gaps.length; i2++) {
            let thisGap = gaps[i2];
            let nextGap = gaps[i2 + 1];
            if (nextGap && thisGap[1] === nextGap[0]) {
              let approxIdx = u.posToIdx(thisGap[1], true);
              if (yData[approxIdx] == null) {
                for (let j = 1; j < 100; j++) {
                  if (yData[approxIdx + j] != null) {
                    approxIdx += j;
                    break;
                  }
                  if (yData[approxIdx - j] != null) {
                    approxIdx -= j;
                    break;
                  }
                }
              }
              filtered.push(approxIdx);
            }
          }
          if (gaps[gaps.length - 1][1] === lastPos) {
            filtered.push(lastIdx);
          }
        }
        return filtered.length ? filtered : null;
      };
    }
    let { fillOpacity } = customConfig;
    let pathBuilder = null;
    let pointsBuilder = null;
    if ((_r = field.state) == null ? void 0 : _r.origin) {
      if (!indexByName) {
        indexByName = getNamesToFieldIndex(frame, allFrames);
      }
      const originFrame = allFrames[field.state.origin.frameIndex];
      const originField = originFrame == null ? void 0 : originFrame.fields[field.state.origin.fieldIndex];
      const dispName = getFieldDisplayName(originField != null ? originField : field, originFrame, allFrames);
      if (customRenderedFields.indexOf(dispName) >= 0) {
        pathBuilder = () => null;
        pointsBuilder = () => void 0;
      } else if (customConfig.transform === GraphTransform.Constant) {
        const defaultBuilder = uPlot.paths.linear();
        pathBuilder = (u, seriesIdx) => {
          const _data = u._data;
          const r = getTimeRange();
          let xData = [r.from.valueOf(), r.to.valueOf()];
          let firstY = _data[seriesIdx].find((v) => v != null);
          let yData = [firstY, firstY];
          let fauxData = _data.slice();
          fauxData[0] = xData;
          fauxData[seriesIdx] = yData;
          return defaultBuilder(
            __spreadProps(__spreadValues({}, u), {
              _data: fauxData
            }),
            seriesIdx,
            0,
            1
          );
        };
      }
      if (customConfig.fillBelowTo) {
        const fillBelowToField = frame.fields.find(
          (f) => {
            var _a2;
            return customConfig.fillBelowTo === f.name || customConfig.fillBelowTo === ((_a2 = f.config) == null ? void 0 : _a2.displayNameFromDS) || customConfig.fillBelowTo === getFieldDisplayName(f, frame, allFrames);
          }
        );
        const fillBelowDispName = fillBelowToField ? getFieldDisplayName(fillBelowToField, frame, allFrames) : customConfig.fillBelowTo;
        const t = indexByName.get(dispName);
        const b = indexByName.get(fillBelowDispName);
        if (isNumber(b) && isNumber(t)) {
          builder.addBand({
            series: [t, b],
            fill: void 0
            // using null will have the band use fill options from `t`
          });
          if (!fillOpacity) {
            fillOpacity = 35;
          }
        } else {
          fillOpacity = 0;
        }
      }
    }
    let dynamicSeriesColor = void 0;
    if (colorMode.id === FieldColorModeId.Thresholds) {
      dynamicSeriesColor = (seriesIdx) => getFieldSeriesColor(alignedFrame.fields[seriesIdx], theme).color;
    }
    builder.addSeries({
      pathBuilder,
      pointsBuilder,
      scaleKey,
      showPoints,
      pointsFilter,
      colorMode,
      fillOpacity,
      theme,
      dynamicSeriesColor,
      drawStyle: customConfig.drawStyle,
      lineColor: (_s = customConfig.lineColor) != null ? _s : seriesColor,
      lineWidth: customConfig.lineWidth,
      lineInterpolation: customConfig.lineInterpolation,
      lineStyle: customConfig.lineStyle,
      barAlignment: customConfig.barAlignment,
      barWidthFactor: customConfig.barWidthFactor,
      barMaxWidth: customConfig.barMaxWidth,
      pointSize: customConfig.pointSize,
      spanNulls: customConfig.spanNulls || false,
      show: !((_t = customConfig.hideFrom) == null ? void 0 : _t.viz),
      gradientMode: customConfig.gradientMode,
      thresholds: config.thresholds,
      hardMin: field.config.min,
      hardMax: field.config.max,
      softMin: customConfig.axisSoftMin,
      softMax: customConfig.axisSoftMax,
      // The following properties are not used in the uPlot config, but are utilized as transport for legend config
      dataFrameFieldIndex: (_u = field.state) == null ? void 0 : _u.origin
    });
    if (customConfig.thresholdsStyle && config.thresholds) {
      const thresholdDisplay = (_v = customConfig.thresholdsStyle.mode) != null ? _v : GraphThresholdsStyleMode.Off;
      if (thresholdDisplay !== GraphThresholdsStyleMode.Off) {
        builder.addThresholds({
          config: customConfig.thresholdsStyle,
          thresholds: config.thresholds,
          scaleKey,
          theme,
          hardMin: field.config.min,
          hardMax: field.config.max,
          softMin: customConfig.axisSoftMin,
          softMax: customConfig.axisSoftMax
        });
      }
    }
  }
  let stackingGroups = getStackingGroups(frame);
  builder.setStackingGroups(stackingGroups);
  renderers == null ? void 0 : renderers.forEach((r) => {
    if (!indexByName) {
      indexByName = getNamesToFieldIndex(frame, allFrames);
    }
    let fieldIndices = {};
    for (let key in r.fieldMap) {
      let dispName = r.fieldMap[key];
      fieldIndices[key] = indexByName.get(dispName);
    }
    r.init(builder, fieldIndices);
  });
  builder.scaleKeys = [xScaleKey, yScaleKey];
  const hoverProximityPx = 15;
  let cursor = {
    // this scans left and right from cursor position to find nearest data index with value != null
    // TODO: do we want to only scan past undefined values, but halt at explicit null values?
    dataIdx: (self, seriesIdx, hoveredIdx, cursorXVal) => {
      let seriesData = self.data[seriesIdx];
      if (seriesData[hoveredIdx] == null) {
        let nonNullLft = null, nonNullRgt = null, i;
        i = hoveredIdx;
        while (nonNullLft == null && i-- > 0) {
          if (seriesData[i] != null) {
            nonNullLft = i;
          }
        }
        i = hoveredIdx;
        while (nonNullRgt == null && i++ < seriesData.length) {
          if (seriesData[i] != null) {
            nonNullRgt = i;
          }
        }
        let xVals = self.data[0];
        let curPos = self.valToPos(cursorXVal, "x");
        let rgtPos = nonNullRgt == null ? Infinity : self.valToPos(xVals[nonNullRgt], "x");
        let lftPos = nonNullLft == null ? -Infinity : self.valToPos(xVals[nonNullLft], "x");
        let lftDelta = curPos - lftPos;
        let rgtDelta = rgtPos - curPos;
        if (lftDelta <= rgtDelta) {
          if (lftDelta <= hoverProximityPx) {
            hoveredIdx = nonNullLft;
          }
        } else {
          if (rgtDelta <= hoverProximityPx) {
            hoveredIdx = nonNullRgt;
          }
        }
      }
      return hoveredIdx;
    }
  };
  if (sync && sync() !== DashboardCursorSync.Off) {
    cursor.sync = {
      key: eventsScope,
      scales: [xScaleKey, null]
    };
  }
  builder.setCursor(cursor);
  return builder;
};
function getNamesToFieldIndex(frame, allFrames) {
  const originNames = /* @__PURE__ */ new Map();
  frame.fields.forEach((field, i) => {
    var _a, _b;
    const origin = (_a = field.state) == null ? void 0 : _a.origin;
    if (origin) {
      const origField = (_b = allFrames[origin.frameIndex]) == null ? void 0 : _b.fields[origin.fieldIndex];
      if (origField) {
        originNames.set(getFieldDisplayName(origField, allFrames[origin.frameIndex], allFrames), i);
      }
    }
  });
  return originNames;
}

export { getNamesToFieldIndex, preparePlotConfigBuilder };
//# sourceMappingURL=utils.js.map
