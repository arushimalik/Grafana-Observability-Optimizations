import { merge } from 'lodash';
import uPlot from 'uplot';
import { getTimeZoneInfo, DefaultTimeZone } from '@grafana/data';
import { AxisPlacement } from '@grafana/schema';
import { pluginLog, getStackingBands, DEFAULT_PLOT_CONFIG } from '../utils.js';
import { UPlotAxisBuilder } from './UPlotAxisBuilder.js';
import { UPlotScaleBuilder } from './UPlotScaleBuilder.js';
import { UPlotSeriesBuilder } from './UPlotSeriesBuilder.js';
import { getThresholdsDrawHook } from './UPlotThresholds.js';

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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const cursorDefaults = {
  // prevent client-side zoom from triggering at the end of a selection
  drag: { setScale: false },
  points: {
    /*@ts-ignore*/
    size: (u, seriesIdx) => u.series[seriesIdx].points.size * 2,
    /*@ts-ignore*/
    width: (u, seriesIdx, size) => size / 4
  },
  focus: {
    prox: 30
  }
};
class UPlotConfigBuilder {
  constructor(timeZone = DefaultTimeZone) {
    __publicField(this, "uid", Math.random().toString(36).slice(2));
    __publicField(this, "series", []);
    __publicField(this, "axes", {});
    __publicField(this, "scales", []);
    __publicField(this, "bands", []);
    __publicField(this, "stackingGroups", []);
    __publicField(this, "cursor");
    __publicField(this, "select");
    __publicField(this, "hasLeftAxis", false);
    __publicField(this, "hooks", {});
    __publicField(this, "tz");
    __publicField(this, "mode", 1);
    __publicField(this, "frames");
    // to prevent more than one threshold per scale
    __publicField(this, "thresholds", {});
    __publicField(this, "padding");
    __publicField(this, "cachedConfig");
    __publicField(this, "prepData");
    // Exposed to let the container know the primary scale keys
    __publicField(this, "scaleKeys", ["", ""]);
    __publicField(this, "tzDate", (ts) => {
      let date = new Date(ts);
      return this.tz ? uPlot.tzDate(date, this.tz) : date;
    });
    var _a;
    this.tz = (_a = getTimeZoneInfo(timeZone, Date.now())) == null ? void 0 : _a.ianaName;
  }
  addHook(type, hook) {
    pluginLog("UPlotConfigBuilder", false, "addHook", type);
    if (!this.hooks[type]) {
      this.hooks[type] = [];
    }
    this.hooks[type].push(hook);
  }
  addThresholds(options) {
    if (!this.thresholds[options.scaleKey]) {
      this.thresholds[options.scaleKey] = options;
      this.addHook("drawClear", getThresholdsDrawHook(options));
    }
  }
  addAxis(props) {
    var _a, _b, _c;
    props.placement = (_a = props.placement) != null ? _a : AxisPlacement.Auto;
    props.grid = (_b = props.grid) != null ? _b : {};
    let scaleKey = props.scaleKey;
    if (scaleKey === "x") {
      scaleKey += (_c = props.timeZone) != null ? _c : "";
    }
    if (this.axes[scaleKey]) {
      this.axes[scaleKey].merge(props);
      return;
    }
    if (props.placement === AxisPlacement.Auto) {
      props.placement = this.hasLeftAxis ? AxisPlacement.Right : AxisPlacement.Left;
    }
    if (props.placement === AxisPlacement.Left) {
      this.hasLeftAxis = true;
    }
    if (props.placement === AxisPlacement.Hidden) {
      props.grid.show = false;
      props.size = 0;
    }
    this.axes[scaleKey] = new UPlotAxisBuilder(props);
  }
  getAxisPlacement(scaleKey) {
    var _a;
    const axis = this.axes[scaleKey];
    return (_a = axis == null ? void 0 : axis.props.placement) != null ? _a : AxisPlacement.Left;
  }
  setCursor(cursor) {
    this.cursor = merge({}, this.cursor, cursor);
  }
  setMode(mode) {
    this.mode = mode;
  }
  setSelect(select) {
    this.select = select;
  }
  addSeries(props) {
    this.series.push(new UPlotSeriesBuilder(props));
  }
  getSeries() {
    return this.series;
  }
  /** Add or update the scale with the scale key */
  addScale(props) {
    const current = this.scales.find((v) => v.props.scaleKey === props.scaleKey);
    if (current) {
      current.merge(props);
      return;
    }
    this.scales.push(new UPlotScaleBuilder(props));
  }
  addBand(band) {
    this.bands.push(band);
  }
  setStackingGroups(groups) {
    this.stackingGroups = groups;
  }
  getStackingGroups() {
    return this.stackingGroups;
  }
  setPrepData(prepData) {
    this.prepData = (frames) => {
      this.frames = frames;
      return prepData(frames, this.getStackingGroups());
    };
  }
  setPadding(padding) {
    this.padding = padding;
  }
  getConfig() {
    if (this.cachedConfig) {
      return this.cachedConfig;
    }
    const config = __spreadProps(__spreadValues({}, DEFAULT_PLOT_CONFIG), {
      mode: this.mode,
      series: [
        this.mode === 2 ? null : {
          value: () => ""
        }
      ]
    });
    config.axes = this.ensureNonOverlappingAxes(Object.values(this.axes)).map((a) => a.getConfig());
    config.series = [...config.series, ...this.series.map((s) => s.getConfig())];
    config.scales = this.scales.reduce((acc, s) => {
      return __spreadValues(__spreadValues({}, acc), s.getConfig());
    }, {});
    config.hooks = this.hooks;
    config.select = this.select;
    const pointColorFn = (alphaHex = "") => (u, seriesIdx) => {
      let s = u.series[seriesIdx].points._stroke;
      if (typeof s !== "string") {
        let field = this.frames[0].fields[seriesIdx];
        s = field.display(field.values[u.cursor.idxs[seriesIdx]]).color;
      }
      return s + alphaHex;
    };
    config.cursor = merge(
      {},
      cursorDefaults,
      {
        points: {
          stroke: pointColorFn("80"),
          fill: pointColorFn()
        }
      },
      this.cursor
    );
    config.tzDate = this.tzDate;
    if (Array.isArray(this.padding)) {
      config.padding = this.padding;
    }
    this.stackingGroups.forEach((group) => {
      getStackingBands(group).forEach((band) => {
        this.addBand(band);
      });
    });
    if (this.bands.length) {
      config.bands = this.bands;
    }
    this.cachedConfig = config;
    return config;
  }
  ensureNonOverlappingAxes(axes) {
    const xAxis = axes.find((a) => a.props.scaleKey === "x");
    const axesWithoutGridSet = axes.filter((a) => {
      var _a;
      return ((_a = a.props.grid) == null ? void 0 : _a.show) === void 0;
    });
    const firstValueAxisIdx = axesWithoutGridSet.findIndex(
      (a) => a.props.placement === AxisPlacement.Left || a.props.placement === AxisPlacement.Right || a.props.placement === AxisPlacement.Bottom && a !== xAxis
    );
    for (let i = 0; i < axesWithoutGridSet.length; i++) {
      if (axesWithoutGridSet[i] === xAxis || i === firstValueAxisIdx) {
        axesWithoutGridSet[i].props.grid.show = true;
      } else {
        axesWithoutGridSet[i].props.grid.show = false;
      }
    }
    return axes;
  }
}

export { UPlotConfigBuilder };
//# sourceMappingURL=UPlotConfigBuilder.js.map
