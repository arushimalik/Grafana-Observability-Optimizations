function createShape(options) {
  var _a;
  const baseBorderRadius = (_a = options.borderRadius) != null ? _a : 2;
  const radius = {
    default: "2px",
    pill: "9999px",
    circle: "100%"
  };
  const borderRadius = (amount) => {
    const value = (amount != null ? amount : 1) * baseBorderRadius;
    return `${value}px`;
  };
  return {
    radius,
    borderRadius
  };
}

export { createShape };
//# sourceMappingURL=createShape.js.map
