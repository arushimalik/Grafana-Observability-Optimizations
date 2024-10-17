function breakpointCSS(theme, prop, getCSS, key) {
  const value = prop[key];
  if (value !== void 0 && value !== null) {
    return {
      [theme.breakpoints.up(key)]: getCSS(value)
    };
  }
  return;
}
function getResponsiveStyle(theme, prop, getCSS) {
  if (prop === void 0 || prop === null) {
    return null;
  }
  if (typeof prop !== "object" || !("xs" in prop)) {
    return getCSS(prop);
  }
  return [
    breakpointCSS(theme, prop, getCSS, "xs"),
    breakpointCSS(theme, prop, getCSS, "sm"),
    breakpointCSS(theme, prop, getCSS, "md"),
    breakpointCSS(theme, prop, getCSS, "lg"),
    breakpointCSS(theme, prop, getCSS, "xl"),
    breakpointCSS(theme, prop, getCSS, "xxl")
  ];
}

export { getResponsiveStyle };
//# sourceMappingURL=responsiveness.js.map
