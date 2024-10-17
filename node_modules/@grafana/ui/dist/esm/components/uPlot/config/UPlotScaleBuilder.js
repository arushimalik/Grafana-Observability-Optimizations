import uPlot from 'uplot';
import { isBooleanUnit, incrRoundDn, incrRoundUp } from '@grafana/data';
import { ScaleDistribution } from '@grafana/schema';
import { PlotConfigBuilder } from '../types.js';

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
class UPlotScaleBuilder extends PlotConfigBuilder {
  merge(props) {
    this.props.min = optMinMax("min", this.props.min, props.min);
    this.props.max = optMinMax("max", this.props.max, props.max);
  }
  getConfig() {
    var _a, _b;
    let {
      isTime,
      scaleKey,
      min: hardMin,
      max: hardMax,
      softMin,
      softMax,
      range,
      direction,
      orientation,
      centeredZero,
      decimals
    } = this.props;
    const distr = this.props.distribution;
    const distribution = !isTime ? {
      distr: distr === ScaleDistribution.Symlog ? 4 : distr === ScaleDistribution.Log ? 3 : distr === ScaleDistribution.Ordinal ? 2 : 1,
      log: distr === ScaleDistribution.Log || distr === ScaleDistribution.Symlog ? (_a = this.props.log) != null ? _a : 2 : void 0,
      asinh: distr === ScaleDistribution.Symlog ? (_b = this.props.linearThreshold) != null ? _b : 1 : void 0
    } : {};
    if (distr === ScaleDistribution.Log) {
      let logBase = this.props.log;
      let logFn = logBase === 2 ? Math.log2 : Math.log10;
      if (hardMin != null) {
        if (hardMin <= 0) {
          hardMin = null;
        } else {
          hardMin = logBase ** Math.floor(logFn(hardMin));
        }
      }
      if (hardMax != null) {
        if (hardMax <= 0) {
          hardMax = null;
        } else {
          hardMax = logBase ** Math.ceil(logFn(hardMax));
        }
      }
      if (softMin != null) {
        if (softMin <= 0) {
          softMin = null;
        } else {
          softMin = logBase ** Math.floor(logFn(softMin));
        }
      }
      if (softMax != null) {
        if (softMax <= 0) {
          softMax = null;
        } else {
          softMax = logBase ** Math.ceil(logFn(softMax));
        }
      }
    }
    let softMinMode = softMin == null ? 3 : 1;
    let softMaxMode = softMax == null ? 3 : 1;
    const rangeConfig = {
      min: {
        pad: 0.1,
        hard: hardMin != null ? hardMin : -Infinity,
        soft: softMin || 0,
        mode: softMinMode
      },
      max: {
        pad: 0.1,
        hard: hardMax != null ? hardMax : Infinity,
        soft: softMax || 0,
        mode: softMaxMode
      }
    };
    let hardMinOnly = softMin == null && hardMin != null;
    let hardMaxOnly = softMax == null && hardMax != null;
    let hasFixedRange = hardMinOnly && hardMaxOnly;
    const rangeFn = (u, dataMin, dataMax, scaleKey2) => {
      var _a2;
      const scale = u.scales[scaleKey2];
      let minMax = [dataMin, dataMax];
      if (!hasFixedRange && dataMin == null && dataMax == null) {
        return minMax;
      }
      let logBase = (_a2 = scale.log) != null ? _a2 : 10;
      if (scale.distr === 1 || scale.distr === 2 || scale.distr === 4) {
        if (centeredZero) {
          let absMin = Math.abs(dataMin);
          let absMax = Math.abs(dataMax);
          let max = Math.max(absMin, absMax);
          if (max === 0) {
            max = 80;
          }
          dataMin = -max;
          dataMax = max;
        }
        if (scale.distr === 4) {
          minMax = uPlot.rangeAsinh(dataMin, dataMax, logBase, true);
        } else {
          minMax = uPlot.rangeNum(hardMinOnly ? hardMin : dataMin, hardMaxOnly ? hardMax : dataMax, rangeConfig);
        }
      } else if (scale.distr === 3) {
        minMax = uPlot.rangeLog(hardMin != null ? hardMin : dataMin, hardMax != null ? hardMax : dataMax, logBase, true);
      }
      if (decimals === 0) {
        if (scale.distr === 1 || scale.distr === 2) {
          minMax[0] = incrRoundDn(minMax[0], 1);
          minMax[1] = incrRoundUp(minMax[1], 1);
        } else if (scale.distr === 3) {
          let logFn = scale.log === 2 ? Math.log2 : Math.log10;
          if (minMax[0] <= 1) {
            minMax[0] = 1;
          } else {
            let minExp = Math.floor(logFn(minMax[0]));
            minMax[0] = logBase ** minExp;
          }
          let maxExp = Math.ceil(logFn(minMax[1]));
          minMax[1] = logBase ** maxExp;
          if (minMax[0] === minMax[1]) {
            minMax[1] *= logBase;
          }
        } else if (scale.distr === 4) {
          minMax[0] = incrRoundDn(minMax[0], 1);
          minMax[1] = incrRoundUp(minMax[1], 1);
        }
      }
      if (scale.distr === 1 || scale.distr === 4) {
        if (hardMinOnly) {
          minMax[0] = hardMin;
        }
        if (hardMaxOnly) {
          minMax[1] = hardMax;
        }
      }
      if (minMax[0] >= minMax[1]) {
        minMax[0] = scale.distr === 3 ? 1 : 0;
        minMax[1] = 100;
      }
      return minMax;
    };
    let auto = !isTime && !hasFixedRange;
    if (isBooleanUnit(scaleKey)) {
      auto = false;
      range = [0, 1];
    }
    return {
      [scaleKey]: __spreadValues({
        time: isTime,
        auto,
        range: range != null ? range : rangeFn,
        dir: direction,
        ori: orientation
      }, distribution)
    };
  }
}
function optMinMax(minmax, a, b) {
  const hasA = !(a === void 0 || a === null);
  const hasB = !(b === void 0 || b === null);
  if (hasA) {
    if (!hasB) {
      return a;
    }
    if (minmax === "min") {
      return a < b ? a : b;
    }
    return a > b ? a : b;
  }
  return b;
}

export { UPlotScaleBuilder, optMinMax };
//# sourceMappingURL=UPlotScaleBuilder.js.map
