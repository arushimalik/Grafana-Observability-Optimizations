import { merge } from 'lodash';
import { emphasize, getContrastRatio, darken, lighten, alpha } from './colorManipulator.js';
import { palette } from './palette.js';

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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DarkColors {
  constructor() {
    __publicField(this, "mode", "dark");
    // Used to get more white opacity colors
    __publicField(this, "whiteBase", "204, 204, 220");
    __publicField(this, "border", {
      weak: `rgba(${this.whiteBase}, 0.12)`,
      medium: `rgba(${this.whiteBase}, 0.20)`,
      strong: `rgba(${this.whiteBase}, 0.30)`
    });
    __publicField(this, "text", {
      primary: `rgb(${this.whiteBase})`,
      secondary: `rgba(${this.whiteBase}, 0.65)`,
      disabled: `rgba(${this.whiteBase}, 0.6)`,
      link: palette.blueDarkText,
      maxContrast: palette.white
    });
    __publicField(this, "primary", {
      main: palette.blueDarkMain,
      text: palette.blueDarkText,
      border: palette.blueDarkText
    });
    __publicField(this, "secondary", {
      main: `rgba(${this.whiteBase}, 0.10)`,
      shade: `rgba(${this.whiteBase}, 0.14)`,
      transparent: `rgba(${this.whiteBase}, 0.08)`,
      text: this.text.primary,
      contrastText: `rgb(${this.whiteBase})`,
      border: `rgba(${this.whiteBase}, 0.08)`
    });
    __publicField(this, "info", this.primary);
    __publicField(this, "error", {
      main: palette.redDarkMain,
      text: palette.redDarkText
    });
    __publicField(this, "success", {
      main: palette.greenDarkMain,
      text: palette.greenDarkText
    });
    __publicField(this, "warning", {
      main: palette.orangeDarkMain,
      text: palette.orangeDarkText
    });
    __publicField(this, "background", {
      canvas: palette.gray05,
      primary: palette.gray10,
      secondary: palette.gray15
    });
    __publicField(this, "action", {
      hover: `rgba(${this.whiteBase}, 0.16)`,
      selected: `rgba(${this.whiteBase}, 0.12)`,
      selectedBorder: palette.orangeDarkMain,
      focus: `rgba(${this.whiteBase}, 0.16)`,
      hoverOpacity: 0.08,
      disabledText: this.text.disabled,
      disabledBackground: `rgba(${this.whiteBase}, 0.04)`,
      disabledOpacity: 0.38
    });
    __publicField(this, "gradients", {
      brandHorizontal: "linear-gradient(270deg, #F55F3E 0%, #FF8833 100%)",
      brandVertical: "linear-gradient(0.01deg, #F55F3E 0.01%, #FF8833 99.99%)"
    });
    __publicField(this, "contrastThreshold", 3);
    __publicField(this, "hoverFactor", 0.03);
    __publicField(this, "tonalOffset", 0.15);
  }
}
class LightColors {
  constructor() {
    __publicField(this, "mode", "light");
    __publicField(this, "blackBase", "36, 41, 46");
    __publicField(this, "primary", {
      main: palette.blueLightMain,
      border: palette.blueLightText,
      text: palette.blueLightText
    });
    __publicField(this, "text", {
      primary: `rgba(${this.blackBase}, 1)`,
      secondary: `rgba(${this.blackBase}, 0.75)`,
      disabled: `rgba(${this.blackBase}, 0.64)`,
      link: this.primary.text,
      maxContrast: palette.black
    });
    __publicField(this, "border", {
      weak: `rgba(${this.blackBase}, 0.12)`,
      medium: `rgba(${this.blackBase}, 0.30)`,
      strong: `rgba(${this.blackBase}, 0.40)`
    });
    __publicField(this, "secondary", {
      main: `rgba(${this.blackBase}, 0.08)`,
      shade: `rgba(${this.blackBase}, 0.15)`,
      transparent: `rgba(${this.blackBase}, 0.08)`,
      contrastText: `rgba(${this.blackBase},  1)`,
      text: this.text.primary,
      border: this.border.weak
    });
    __publicField(this, "info", {
      main: palette.blueLightMain,
      text: palette.blueLightText
    });
    __publicField(this, "error", {
      main: palette.redLightMain,
      text: palette.redLightText,
      border: palette.redLightText
    });
    __publicField(this, "success", {
      main: palette.greenLightMain,
      text: palette.greenLightText
    });
    __publicField(this, "warning", {
      main: palette.orangeLightMain,
      text: palette.orangeLightText
    });
    __publicField(this, "background", {
      canvas: palette.gray90,
      primary: palette.white,
      secondary: palette.gray100
    });
    __publicField(this, "action", {
      hover: `rgba(${this.blackBase}, 0.12)`,
      selected: `rgba(${this.blackBase}, 0.08)`,
      selectedBorder: palette.orangeLightMain,
      hoverOpacity: 0.08,
      focus: `rgba(${this.blackBase}, 0.12)`,
      disabledBackground: `rgba(${this.blackBase}, 0.04)`,
      disabledText: this.text.disabled,
      disabledOpacity: 0.38
    });
    __publicField(this, "gradients", {
      brandHorizontal: "linear-gradient(90deg, #FF8833 0%, #F53E4C 100%)",
      brandVertical: "linear-gradient(0.01deg, #F53E4C -31.2%, #FF8833 113.07%)"
    });
    __publicField(this, "contrastThreshold", 3);
    __publicField(this, "hoverFactor", 0.03);
    __publicField(this, "tonalOffset", 0.2);
  }
}
function createColors(colors) {
  var _a;
  const dark = new DarkColors();
  const light = new LightColors();
  const base = ((_a = colors.mode) != null ? _a : "dark") === "dark" ? dark : light;
  const _b = colors, {
    primary = base.primary,
    secondary = base.secondary,
    info = base.info,
    warning = base.warning,
    success = base.success,
    error = base.error,
    tonalOffset = base.tonalOffset,
    hoverFactor = base.hoverFactor,
    contrastThreshold = base.contrastThreshold
  } = _b, other = __objRest(_b, [
    "primary",
    "secondary",
    "info",
    "warning",
    "success",
    "error",
    "tonalOffset",
    "hoverFactor",
    "contrastThreshold"
  ]);
  function getContrastText(background, threshold = contrastThreshold) {
    const contrastText = getContrastRatio(dark.text.maxContrast, background, base.background.primary) >= threshold ? dark.text.maxContrast : light.text.maxContrast;
    return contrastText;
  }
  const getRichColor = ({ color, name }) => {
    color = __spreadProps(__spreadValues({}, color), { name });
    if (!color.main) {
      throw new Error(`Missing main color for ${name}`);
    }
    if (!color.text) {
      color.text = color.main;
    }
    if (!color.border) {
      color.border = color.text;
    }
    if (!color.shade) {
      color.shade = base.mode === "light" ? darken(color.main, tonalOffset) : lighten(color.main, tonalOffset);
    }
    if (!color.transparent) {
      color.transparent = alpha(color.main, 0.15);
    }
    if (!color.contrastText) {
      color.contrastText = getContrastText(color.main);
    }
    if (!color.borderTransparent) {
      color.borderTransparent = alpha(color.border, 0.25);
    }
    return color;
  };
  return merge(
    __spreadProps(__spreadValues({}, base), {
      primary: getRichColor({ color: primary, name: "primary" }),
      secondary: getRichColor({ color: secondary, name: "secondary" }),
      info: getRichColor({ color: info, name: "info" }),
      error: getRichColor({ color: error, name: "error" }),
      success: getRichColor({ color: success, name: "success" }),
      warning: getRichColor({ color: warning, name: "warning" }),
      getContrastText,
      emphasize: (color, factor) => {
        return emphasize(color, factor != null ? factor : hoverFactor);
      }
    }),
    other
  );
}

export { createColors };
//# sourceMappingURL=createColors.js.map
