import uPlot from 'uplot';
import { FALLBACK_COLOR, FieldColorModeId, colorManipulator } from '@grafana/data';
import { GraphDrawStyle, VisibilityMode, GraphGradientMode, LineInterpolation, BarAlignment } from '@grafana/schema';
import { PlotConfigBuilder } from '../types.js';
import { getScaleGradientFn, getHueGradientFn, getOpacityGradientFn } from './gradientFills.js';

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
class UPlotSeriesBuilder extends PlotConfigBuilder {
  getConfig() {
    var _a;
    const {
      facets,
      drawStyle,
      pathBuilder,
      pointsBuilder,
      pointsFilter,
      lineInterpolation,
      lineWidth,
      lineStyle,
      barAlignment,
      barWidthFactor,
      barMaxWidth,
      showPoints,
      pointSize,
      scaleKey,
      pxAlign,
      spanNulls,
      show = true
    } = this.props;
    let lineConfig = {};
    let lineColor = this.getLineColor();
    lineConfig.stroke = lineColor;
    lineConfig.width = lineWidth;
    if (lineStyle && lineStyle.fill !== "solid") {
      if (lineStyle.fill === "dot") {
        lineConfig.cap = "round";
      }
      lineConfig.dash = (_a = lineStyle.dash) != null ? _a : [10, 10];
    }
    if (pathBuilder != null) {
      lineConfig.paths = pathBuilder;
    } else if (drawStyle === GraphDrawStyle.Points) {
      lineConfig.paths = () => null;
    } else if (drawStyle != null) {
      lineConfig.paths = (self, seriesIdx, idx0, idx1) => {
        let pathsBuilder = mapDrawStyleToPathBuilder(
          drawStyle,
          lineInterpolation,
          barAlignment,
          barWidthFactor,
          barMaxWidth
        );
        return pathsBuilder(self, seriesIdx, idx0, idx1);
      };
    }
    const useColor = (
      // @ts-ignore
      typeof lineColor === "string" ? lineColor : (u, seriesIdx) => u.series[seriesIdx]._stroke
    );
    const pointsConfig = {
      points: {
        stroke: useColor,
        fill: useColor,
        size: !pointSize || pointSize < lineWidth ? void 0 : pointSize,
        filter: pointsFilter
      }
    };
    if (pointsBuilder != null) {
      pointsConfig.points.show = pointsBuilder;
    } else {
      if (drawStyle === GraphDrawStyle.Points) {
        pointsConfig.points.show = true;
      } else {
        if (showPoints === VisibilityMode.Auto) {
          if (drawStyle === GraphDrawStyle.Bars) {
            pointsConfig.points.show = false;
          }
        } else if (showPoints === VisibilityMode.Never) {
          pointsConfig.points.show = false;
        } else if (showPoints === VisibilityMode.Always) {
          pointsConfig.points.show = true;
        }
      }
    }
    return __spreadValues(__spreadValues({
      scale: scaleKey,
      facets,
      spanGaps: typeof spanNulls === "number" ? false : spanNulls,
      value: () => "",
      pxAlign,
      show,
      fill: this.getFill()
    }, lineConfig), pointsConfig);
  }
  getLineColor() {
    const {
      lineColor,
      gradientMode,
      colorMode,
      thresholds,
      theme,
      hardMin,
      hardMax,
      softMin,
      softMax,
      dynamicSeriesColor
    } = this.props;
    if (gradientMode === GraphGradientMode.None && dynamicSeriesColor) {
      return (plot, seriesIdx) => {
        var _a, _b;
        return (_b = (_a = dynamicSeriesColor(seriesIdx)) != null ? _a : lineColor) != null ? _b : FALLBACK_COLOR;
      };
    }
    if (gradientMode === GraphGradientMode.Scheme && (colorMode == null ? void 0 : colorMode.id) !== FieldColorModeId.Fixed) {
      return getScaleGradientFn(1, theme, colorMode, thresholds, hardMin, hardMax, softMin, softMax);
    }
    if (gradientMode === GraphGradientMode.Hue) {
      return getHueGradientFn(lineColor != null ? lineColor : FALLBACK_COLOR, 1, theme);
    }
    return lineColor != null ? lineColor : FALLBACK_COLOR;
  }
  getFill() {
    const {
      lineColor,
      fillColor,
      gradientMode,
      fillOpacity,
      colorMode,
      thresholds,
      theme,
      hardMin,
      hardMax,
      softMin,
      softMax,
      dynamicSeriesColor
    } = this.props;
    if (fillColor) {
      return fillColor;
    }
    const mode = gradientMode != null ? gradientMode : GraphGradientMode.None;
    const opacityPercent = (fillOpacity != null ? fillOpacity : 0) / 100;
    if (mode === GraphGradientMode.None && dynamicSeriesColor && opacityPercent > 0) {
      return (u, seriesIdx) => {
        let lineColor2 = u.series[seriesIdx]._stroke;
        return colorManipulator.alpha(lineColor2 != null ? lineColor2 : "", opacityPercent);
      };
    }
    switch (mode) {
      case GraphGradientMode.Opacity:
        return getOpacityGradientFn(fillColor != null ? fillColor : lineColor, opacityPercent);
      case GraphGradientMode.Hue:
        return getHueGradientFn(fillColor != null ? fillColor : lineColor, opacityPercent, theme);
      case GraphGradientMode.Scheme:
        if ((colorMode == null ? void 0 : colorMode.id) !== FieldColorModeId.Fixed) {
          return getScaleGradientFn(opacityPercent, theme, colorMode, thresholds, hardMin, hardMax, softMin, softMax);
        }
      default:
        if (opacityPercent > 0) {
          return colorManipulator.alpha(lineColor != null ? lineColor : "", opacityPercent);
        }
    }
    return void 0;
  }
}
let builders = void 0;
function mapDrawStyleToPathBuilder(style, lineInterpolation, barAlignment = BarAlignment.Center, barWidthFactor = 0.6, barMaxWidth = 200) {
  const pathBuilders = uPlot.paths;
  if (!builders) {
    builders = {
      linear: pathBuilders.linear(),
      smooth: pathBuilders.spline(),
      stepBefore: pathBuilders.stepped({ align: -1 }),
      stepAfter: pathBuilders.stepped({ align: 1 })
    };
  }
  if (style === GraphDrawStyle.Bars) {
    let barsCfgKey = `bars|${barAlignment}|${barWidthFactor}|${barMaxWidth}`;
    if (!builders[barsCfgKey]) {
      builders[barsCfgKey] = pathBuilders.bars({
        size: [barWidthFactor, barMaxWidth],
        align: barAlignment
      });
    }
    return builders[barsCfgKey];
  } else if (style === GraphDrawStyle.Line) {
    if (lineInterpolation === LineInterpolation.StepBefore) {
      return builders.stepBefore;
    }
    if (lineInterpolation === LineInterpolation.StepAfter) {
      return builders.stepAfter;
    }
    if (lineInterpolation === LineInterpolation.Smooth) {
      return builders.smooth;
    }
  }
  return builders.linear;
}

export { UPlotSeriesBuilder };
//# sourceMappingURL=UPlotSeriesBuilder.js.map
