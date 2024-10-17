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
const defaultFontFamily = '"Inter", "Helvetica", "Arial", sans-serif';
const defaultFontFamilyMonospace = "'Roboto Mono', monospace";
function createTypography(colors, typographyInput = {}) {
  const {
    fontFamily = defaultFontFamily,
    fontFamilyMonospace = defaultFontFamilyMonospace,
    // The default font size of the Material Specification.
    fontSize = 14,
    // px
    fontWeightLight = 300,
    fontWeightRegular = 400,
    fontWeightMedium = 500,
    fontWeightBold = 500,
    // Tell Grafana-UI what's the font-size on the html element.
    // 16px is the default font-size used by browsers.
    htmlFontSize = 14
  } = typographyInput;
  if (process.env.NODE_ENV !== "production") {
    if (typeof fontSize !== "number") {
      console.error("Grafana-UI: `fontSize` is required to be a number.");
    }
    if (typeof htmlFontSize !== "number") {
      console.error("Grafana-UI: `htmlFontSize` is required to be a number.");
    }
  }
  const coef = fontSize / 14;
  const pxToRem = (size2) => `${size2 / htmlFontSize * coef}rem`;
  const buildVariant = (fontWeight, size2, lineHeight, letterSpacing, casing) => {
    if (lineHeight % 2 !== 0 || size2 % 2 !== 0) {
      throw new Error("Font size and line height should be integer multiples of 2 to prevent issues with alignment");
    }
    return __spreadValues(__spreadValues({
      fontFamily,
      fontWeight,
      fontSize: pxToRem(size2),
      lineHeight: lineHeight / size2
    }, fontFamily === defaultFontFamily ? { letterSpacing: `${round(letterSpacing / size2)}em` } : {}), casing);
  };
  const variants = {
    h1: buildVariant(fontWeightRegular, 28, 32, -0.25),
    h2: buildVariant(fontWeightRegular, 24, 28, 0),
    h3: buildVariant(fontWeightRegular, 22, 24, 0),
    h4: buildVariant(fontWeightRegular, 18, 22, 0.25),
    h5: buildVariant(fontWeightRegular, 16, 22, 0),
    h6: buildVariant(fontWeightMedium, 14, 22, 0.15),
    body: buildVariant(fontWeightRegular, fontSize, 22, 0.15),
    bodySmall: buildVariant(fontWeightRegular, 12, 18, 0.15),
    code: __spreadProps(__spreadValues({}, buildVariant(fontWeightRegular, 14, 16, 0.15)), { fontFamily: fontFamilyMonospace })
  };
  const size = {
    base: "14px",
    xs: "10px",
    sm: "12px",
    md: "14px",
    lg: "18px"
  };
  return __spreadValues({
    htmlFontSize,
    pxToRem,
    fontFamily,
    fontFamilyMonospace,
    fontSize,
    fontWeightLight,
    fontWeightRegular,
    fontWeightMedium,
    fontWeightBold,
    size
  }, variants);
}
function round(value) {
  return Math.round(value * 1e5) / 1e5;
}

export { createTypography };
//# sourceMappingURL=createTypography.js.map
