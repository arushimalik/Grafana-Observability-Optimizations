import tinycolor from 'tinycolor2';

function getColors(theme) {
  if (theme === void 0) {
    return {};
  } else {
    const colors = {
      "editor.background": theme.components.input.background,
      "minimap.background": theme.colors.background.secondary
    };
    Object.keys(colors).forEach((resultKey) => {
      colors[resultKey] = normalizeColorForMonaco(colors[resultKey]);
    });
    return colors;
  }
}
function normalizeColorForMonaco(color) {
  return tinycolor(color).toHexString();
}
function defineThemes(monaco, theme) {
  const colors = getColors(theme);
  monaco.editor.defineTheme("grafana-dark", {
    base: "vs-dark",
    inherit: true,
    colors,
    // fallback syntax highlighting for languages that microsoft doesn't handle (ex cloudwatch's metric math)
    rules: [
      { token: "predefined", foreground: normalizeColorForMonaco(theme == null ? void 0 : theme.visualization.getColorByName("purple")) },
      { token: "operator", foreground: normalizeColorForMonaco(theme == null ? void 0 : theme.visualization.getColorByName("orange")) },
      { token: "tag", foreground: normalizeColorForMonaco(theme == null ? void 0 : theme.visualization.getColorByName("green")) }
    ]
  });
  monaco.editor.defineTheme("grafana-light", {
    base: "vs",
    inherit: true,
    colors,
    // fallback syntax highlighting for languages that microsoft doesn't handle (ex cloudwatch's metric math)
    rules: [
      { token: "predefined", foreground: normalizeColorForMonaco(theme == null ? void 0 : theme.visualization.getColorByName("purple")) },
      { token: "operator", foreground: normalizeColorForMonaco(theme == null ? void 0 : theme.visualization.getColorByName("orange")) },
      { token: "tag", foreground: normalizeColorForMonaco(theme == null ? void 0 : theme.visualization.getColorByName("green")) }
    ]
  });
}

export { defineThemes as default };
//# sourceMappingURL=theme.js.map
