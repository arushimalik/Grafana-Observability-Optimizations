const customWeight = (weight, theme) => {
  switch (weight) {
    case "bold":
      return theme.typography.fontWeightBold;
    case "medium":
      return theme.typography.fontWeightMedium;
    case "light":
      return theme.typography.fontWeightLight;
    case "regular":
    case void 0:
      return theme.typography.fontWeightRegular;
  }
};
const customColor = (color, theme) => {
  switch (color) {
    case "error":
      return theme.colors.error.text;
    case "success":
      return theme.colors.success.text;
    case "info":
      return theme.colors.info.text;
    case "warning":
      return theme.colors.warning.text;
    default:
      return color ? theme.colors.text[color] : void 0;
  }
};
const customVariant = (theme, element, variant) => {
  if (variant) {
    return theme.typography[variant];
  }
  switch (element) {
    case "span":
      return;
    case "h1":
      return theme.typography.h1;
    case "h2":
      return theme.typography.h2;
    case "h3":
      return theme.typography.h3;
    case "h4":
      return theme.typography.h4;
    case "h5":
      return theme.typography.h5;
    case "h6":
      return theme.typography.h6;
    default:
      return theme.typography.body;
  }
};

export { customColor, customVariant, customWeight };
//# sourceMappingURL=utils.js.map
