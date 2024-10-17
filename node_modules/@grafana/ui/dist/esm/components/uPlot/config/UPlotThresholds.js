import tinycolor from 'tinycolor2';
import { ThresholdsMode } from '@grafana/data';
import { GraphThresholdsStyleMode } from '@grafana/schema';
import { getGradientRange, scaleGradient } from './gradientFills.js';

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
function getThresholdsDrawHook(options) {
  const dashSegments = options.config.mode === GraphThresholdsStyleMode.Dashed || options.config.mode === GraphThresholdsStyleMode.DashedAndArea ? [10, 10] : [];
  function addLines(u, yScaleKey, steps, theme2) {
    let ctx = u.ctx;
    let transparentIndex = 0;
    for (let idx = 0; idx < steps.length; idx++) {
      const step = steps[idx];
      if (step.color === "transparent") {
        transparentIndex = idx;
        break;
      }
    }
    ctx.lineWidth = 2;
    ctx.setLineDash(dashSegments);
    for (let idx = 1; idx < steps.length; idx++) {
      const step = steps[idx];
      let color;
      if (transparentIndex >= idx && idx > 0) {
        color = tinycolor(theme2.visualization.getColorByName(steps[idx - 1].color));
      } else {
        color = tinycolor(theme2.visualization.getColorByName(step.color));
      }
      if (color.getAlpha() === 1) {
        color.setAlpha(0.7);
      }
      let x0 = Math.round(u.bbox.left);
      let y0 = Math.round(u.valToPos(step.value, yScaleKey, true));
      let x1 = Math.round(u.bbox.left + u.bbox.width);
      let y1 = Math.round(u.valToPos(step.value, yScaleKey, true));
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.strokeStyle = color.toString();
      ctx.stroke();
    }
  }
  function addAreas(u, yScaleKey, steps, theme2) {
    let ctx = u.ctx;
    let grd = scaleGradient(
      u,
      yScaleKey,
      steps.map((step) => {
        let color = tinycolor(theme2.visualization.getColorByName(step.color));
        if (color.getAlpha() === 1) {
          color.setAlpha(0.15);
        }
        return [step.value, color.toString()];
      }),
      true
    );
    ctx.fillStyle = grd;
    ctx.fillRect(u.bbox.left, u.bbox.top, u.bbox.width, u.bbox.height);
  }
  const { scaleKey, thresholds, theme, config, hardMin, hardMax, softMin, softMax } = options;
  return (u) => {
    const ctx = u.ctx;
    const { min: xMin, max: xMax } = u.scales.x;
    const { min: yMin, max: yMax } = u.scales[scaleKey];
    if (xMin == null || xMax == null || yMin == null || yMax == null) {
      return;
    }
    let { steps, mode } = thresholds;
    if (mode === ThresholdsMode.Percentage) {
      let [min, max] = getGradientRange(u, scaleKey, hardMin, hardMax, softMin, softMax);
      let range = max - min;
      steps = steps.map((step) => __spreadProps(__spreadValues({}, step), {
        value: min + range * (step.value / 100)
      }));
    }
    ctx.save();
    switch (config.mode) {
      case GraphThresholdsStyleMode.Line:
      case GraphThresholdsStyleMode.Dashed:
        addLines(u, scaleKey, steps, theme);
        break;
      case GraphThresholdsStyleMode.Area:
        addAreas(u, scaleKey, steps, theme);
        break;
      case GraphThresholdsStyleMode.LineAndArea:
      case GraphThresholdsStyleMode.DashedAndArea:
        addAreas(u, scaleKey, steps, theme);
        addLines(u, scaleKey, steps, theme);
    }
    ctx.restore();
  };
}

export { getThresholdsDrawHook };
//# sourceMappingURL=UPlotThresholds.js.map
