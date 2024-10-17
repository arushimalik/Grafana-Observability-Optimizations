import { ThresholdsMode, FieldColorModeId, GAUGE_DEFAULT_MINIMUM, FALLBACK_COLOR, GAUGE_DEFAULT_MAXIMUM, getActiveThreshold } from '@grafana/data';
import { VizOrientation } from '@grafana/schema';

const DEFAULT_THRESHOLDS = {
  mode: ThresholdsMode.Absolute,
  steps: [
    { value: -Infinity, color: "green" },
    { value: 80, color: "red" }
  ]
};
function calculateGaugeAutoProps(width, height, title, orientation) {
  const showLabel = title !== null && title !== void 0;
  const titleFontSizeDimension = orientation === VizOrientation.Vertical ? height : width;
  const titleFontSize = Math.min(titleFontSizeDimension * 0.15 / 1.5, 20);
  const titleHeight = titleFontSize * 1.5;
  const availableHeight = showLabel ? height - titleHeight : height;
  const gaugeHeight = Math.min(availableHeight, width);
  return {
    showLabel,
    gaugeHeight,
    titleFontSize
  };
}
function getFormattedThresholds(decimals, field, value, theme) {
  var _a, _b, _c, _d, _e, _f;
  if (((_a = field.color) == null ? void 0 : _a.mode) !== FieldColorModeId.Thresholds) {
    return [{ value: (_b = field.min) != null ? _b : GAUGE_DEFAULT_MINIMUM, color: (_c = value.color) != null ? _c : FALLBACK_COLOR }];
  }
  const thresholds = (_d = field.thresholds) != null ? _d : DEFAULT_THRESHOLDS;
  const isPercent = thresholds.mode === ThresholdsMode.Percentage;
  const steps = thresholds.steps;
  let min = (_e = field.min) != null ? _e : GAUGE_DEFAULT_MINIMUM;
  let max = (_f = field.max) != null ? _f : GAUGE_DEFAULT_MAXIMUM;
  if (isPercent) {
    min = 0;
    max = 100;
  }
  const first = getActiveThreshold(min, steps);
  const last = getActiveThreshold(max, steps);
  const formatted = [
    { value: +min.toFixed(decimals), color: theme.visualization.getColorByName(first.color) }
  ];
  let skip = true;
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    if (skip) {
      if (first === step) {
        skip = false;
      }
      continue;
    }
    const prev = steps[i - 1];
    formatted.push({ value: step.value, color: theme.visualization.getColorByName(prev.color) });
    if (step === last) {
      break;
    }
  }
  formatted.push({ value: +max.toFixed(decimals), color: theme.visualization.getColorByName(last.color) });
  return formatted;
}

export { DEFAULT_THRESHOLDS, calculateGaugeAutoProps, getFormattedThresholds };
//# sourceMappingURL=utils.js.map
