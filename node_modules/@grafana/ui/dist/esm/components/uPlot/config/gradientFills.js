import tinycolor from 'tinycolor2';
import { colorManipulator, FieldColorModeId, ThresholdsMode } from '@grafana/data';
import { ScaleOrientation } from '@grafana/schema';
import { getCanvasContext } from '../../../utils/measureText.js';

function makeDirectionalGradient(direction, bbox, ctx) {
  let x0 = 0, y0 = 0, x1 = 0, y1 = 0;
  if (direction === 3 /* Down */) {
    y0 = bbox.top;
    y1 = bbox.top + bbox.height;
  } else if (direction === 2 /* Left */) {
    x0 = bbox.left + bbox.width;
    x1 = bbox.left;
  } else if (direction === 1 /* Up */) {
    y0 = bbox.top + bbox.height;
    y1 = bbox.top;
  } else if (direction === 0 /* Right */) {
    x0 = bbox.left;
    x1 = bbox.left + bbox.width;
  }
  return ctx.createLinearGradient(x0, y0, x1, y1);
}
function getOpacityGradientFn(color, opacity) {
  return (plot, seriesIdx) => {
    const ctx = getCanvasContext();
    const gradient = makeDirectionalGradient(
      plot.scales.x.ori === ScaleOrientation.Horizontal ? 3 /* Down */ : 2 /* Left */,
      plot.bbox,
      ctx
    );
    gradient.addColorStop(0, colorManipulator.alpha(color, opacity));
    gradient.addColorStop(1, colorManipulator.alpha(color, 0));
    return gradient;
  };
}
function getHueGradientFn(color, opacity, theme) {
  return (plot, seriesIdx) => {
    const ctx = getCanvasContext();
    const gradient = makeDirectionalGradient(
      plot.scales.x.ori === ScaleOrientation.Horizontal ? 3 /* Down */ : 2 /* Left */,
      plot.bbox,
      ctx
    );
    const color1 = tinycolor(color).spin(-25).darken(5);
    const color2 = tinycolor(color).saturate(20).spin(20).brighten(10);
    if (theme.isDark) {
      gradient.addColorStop(0, color2.lighten(10).setAlpha(opacity).toString());
      gradient.addColorStop(1, color1.darken(10).setAlpha(opacity).toString());
    } else {
      gradient.addColorStop(0, color2.lighten(10).setAlpha(opacity).toString());
      gradient.addColorStop(1, color1.setAlpha(opacity).toString());
    }
    return gradient;
  };
}
function scaleGradient(u, scaleKey, scaleStops, discrete = false) {
  let scale = u.scales[scaleKey];
  let minStopIdx = null;
  let maxStopIdx = null;
  for (let i = 0; i < scaleStops.length; i++) {
    let stopVal = scaleStops[i][0];
    if (stopVal <= scale.min || minStopIdx == null) {
      minStopIdx = i;
    }
    maxStopIdx = i;
    if (stopVal >= scale.max) {
      break;
    }
  }
  if (minStopIdx === maxStopIdx) {
    return scaleStops[minStopIdx][1];
  }
  let minStopVal = scaleStops[minStopIdx][0];
  let maxStopVal = scaleStops[maxStopIdx][0];
  if (minStopVal === -Infinity) {
    minStopVal = scale.min;
  }
  if (maxStopVal === Infinity) {
    maxStopVal = scale.max;
  }
  let minStopPos = Math.round(u.valToPos(minStopVal, scaleKey, true));
  let maxStopPos = Math.round(u.valToPos(maxStopVal, scaleKey, true));
  let range = minStopPos - maxStopPos;
  if (range === 0) {
    return scaleStops[maxStopIdx][1];
  }
  let x0, y0, x1, y1;
  if (u.scales.x.ori === ScaleOrientation.Horizontal) {
    x0 = x1 = 0;
    y0 = minStopPos;
    y1 = maxStopPos;
  } else {
    y0 = y1 = 0;
    x0 = minStopPos;
    x1 = maxStopPos;
  }
  let ctx = getCanvasContext();
  let grd = ctx.createLinearGradient(x0, y0, x1, y1);
  let prevColor;
  for (let i = minStopIdx; i <= maxStopIdx; i++) {
    let s = scaleStops[i];
    let stopPos = i === minStopIdx ? minStopPos : i === maxStopIdx ? maxStopPos : Math.round(u.valToPos(s[0], scaleKey, true));
    let pct = (minStopPos - stopPos) / range;
    if (discrete && i > minStopIdx) {
      grd.addColorStop(pct, prevColor);
    }
    grd.addColorStop(pct, prevColor = s[1]);
  }
  return grd;
}
function getDataRange(plot, scaleKey) {
  let sc = plot.scales[scaleKey];
  let min = Infinity;
  let max = -Infinity;
  plot.series.forEach((ser, seriesIdx) => {
    if (ser.show && ser.scale === scaleKey) {
      if (ser.min == null) {
        let data = plot.data[seriesIdx];
        for (let i = 0; i < data.length; i++) {
          if (data[i] != null) {
            min = Math.min(min, data[i]);
            max = Math.max(max, data[i]);
          }
        }
      } else {
        min = Math.min(min, ser.min);
        max = Math.max(max, ser.max);
      }
    }
  });
  if (max === min) {
    min = sc.min;
    max = sc.max;
  }
  return [min, max];
}
function getGradientRange(u, scaleKey, hardMin, hardMax, softMin, softMax) {
  var _a, _b, _c, _d;
  let min = (_a = hardMin != null ? hardMin : softMin) != null ? _a : null;
  let max = (_b = hardMax != null ? hardMax : softMax) != null ? _b : null;
  if (min == null || max == null) {
    let [dataMin, dataMax] = getDataRange(u, scaleKey);
    min = (_c = min != null ? min : dataMin) != null ? _c : 0;
    max = (_d = max != null ? max : dataMax) != null ? _d : 100;
  }
  return [min, max];
}
function isStepTransparent(color) {
  return color === "transparent" || color[0] === "#" && color.slice(-2) === "00";
}
function getScaleGradientFn(opacity, theme, colorMode, thresholds, hardMin, hardMax, softMin, softMax) {
  if (!colorMode) {
    throw Error("Missing colorMode required for color scheme gradients");
  }
  if (!thresholds) {
    throw Error("Missing thresholds required for color scheme gradients");
  }
  return (plot, seriesIdx) => {
    let scaleKey = plot.series[seriesIdx].scale;
    let gradient = "";
    if (colorMode.id === FieldColorModeId.Thresholds) {
      if (thresholds.mode === ThresholdsMode.Absolute) {
        const valueStops = thresholds.steps.map((step) => [
          step.value,
          isStepTransparent(step.color) ? "#0000" : colorManipulator.alpha(theme.visualization.getColorByName(step.color), opacity)
        ]);
        gradient = scaleGradient(plot, scaleKey, valueStops, true);
      } else {
        const [min, max] = getGradientRange(plot, scaleKey, hardMin, hardMax, softMin, softMax);
        const range = max - min;
        const valueStops = thresholds.steps.map((step) => [
          min + range * (step.value / 100),
          colorManipulator.alpha(theme.visualization.getColorByName(step.color), opacity)
        ]);
        gradient = scaleGradient(plot, scaleKey, valueStops, true);
      }
    } else if (colorMode.getColors) {
      const colors = colorMode.getColors(theme);
      const [min, max] = getGradientRange(plot, scaleKey, hardMin, hardMax, softMin, softMax);
      const range = max - min;
      const valueStops = colors.map((color, i) => [
        min + range * (i / (colors.length - 1)),
        colorManipulator.alpha(theme.visualization.getColorByName(color), opacity)
      ]);
      gradient = scaleGradient(plot, scaleKey, valueStops, false);
    }
    return gradient;
  };
}

export { getDataRange, getGradientRange, getHueGradientFn, getOpacityGradientFn, getScaleGradientFn, scaleGradient };
//# sourceMappingURL=gradientFills.js.map
