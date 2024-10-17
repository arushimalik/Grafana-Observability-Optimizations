function createSpacing(options = {}) {
  const { gridSize = 8 } = options;
  const transform = (value) => {
    if (typeof value === "string") {
      return value;
    }
    if (process.env.NODE_ENV !== "production") {
      if (typeof value !== "number") {
        console.error(`Expected spacing argument to be a number or a string, got ${value}.`);
      }
    }
    return value * gridSize;
  };
  const spacing = (...args) => {
    if (process.env.NODE_ENV !== "production") {
      if (!(args.length <= 4)) {
        console.error(`Too many arguments provided, expected between 0 and 4, got ${args.length}`);
      }
    }
    if (args.length === 0) {
      args[0] = 1;
    }
    return args.map((argument) => {
      const output = transform(argument);
      return typeof output === "number" ? `${output}px` : output;
    }).join(" ");
  };
  spacing.gridSize = gridSize;
  spacing.x0 = "0px";
  spacing.x0_25 = "2px";
  spacing.x0_5 = "4px";
  spacing.x1 = "8px";
  spacing.x1_5 = "12px";
  spacing.x2 = "16px";
  spacing.x2_5 = "20px";
  spacing.x3 = "24px";
  spacing.x4 = "32px";
  spacing.x5 = "40px";
  spacing.x6 = "48px";
  spacing.x8 = "64px";
  spacing.x10 = "80px";
  return spacing;
}

export { createSpacing };
//# sourceMappingURL=createSpacing.js.map
