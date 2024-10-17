import { createBreakpoints } from './breakpoints.js';
import { createColors } from './createColors.js';
import { createComponents } from './createComponents.js';
import { createShadows } from './createShadows.js';
import { createShape } from './createShape.js';
import { createSpacing } from './createSpacing.js';
import { createTransitions } from './createTransitions.js';
import { createTypography } from './createTypography.js';
import { createV1Theme } from './createV1Theme.js';
import { createVisualizationColors } from './createVisualizationColors.js';
import { zIndex } from './zIndex.js';

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
function createTheme(options = {}) {
  const {
    colors: colorsInput = {},
    spacing: spacingInput = {},
    shape: shapeInput = {},
    typography: typographyInput = {}
  } = options;
  const colors = createColors(colorsInput);
  const breakpoints = createBreakpoints();
  const spacing = createSpacing(spacingInput);
  const shape = createShape(shapeInput);
  const typography = createTypography(colors, typographyInput);
  const shadows = createShadows(colors);
  const transitions = createTransitions();
  const components = createComponents(colors);
  const visualization = createVisualizationColors(colors);
  const theme = {
    name: colors.mode === "dark" ? "Dark" : "Light",
    isDark: colors.mode === "dark",
    isLight: colors.mode === "light",
    colors,
    breakpoints,
    spacing,
    shape,
    components,
    typography,
    shadows,
    transitions,
    visualization,
    zIndex: __spreadValues({}, zIndex),
    flags: {}
  };
  return __spreadProps(__spreadValues({}, theme), {
    v1: createV1Theme(theme)
  });
}

export { createTheme };
//# sourceMappingURL=createTheme.js.map
