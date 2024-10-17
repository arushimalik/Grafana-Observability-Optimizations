function createBreakpoints() {
  const step = 5;
  const keys = ["xs", "sm", "md", "lg", "xl", "xxl"];
  const unit = "px";
  const values = {
    xs: 0,
    sm: 544,
    md: 769,
    // 1 more than regular ipad in portrait
    lg: 992,
    xl: 1200,
    xxl: 1440
  };
  function up(key) {
    const value = typeof key === "number" ? key : values[key];
    return `@media (min-width:${value}${unit})`;
  }
  function down(key) {
    const value = typeof key === "number" ? key : values[key];
    return `@media (max-width:${value - step / 100}${unit})`;
  }
  return {
    values,
    up,
    down,
    keys,
    unit
  };
}

export { createBreakpoints };
//# sourceMappingURL=breakpoints.js.map
