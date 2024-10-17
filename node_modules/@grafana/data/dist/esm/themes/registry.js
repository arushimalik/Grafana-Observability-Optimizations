import { Registry } from '../utils/Registry.js';
import { createTheme } from './createTheme.js';

function getThemeById(id) {
  var _a;
  const theme = (_a = themeRegistry.getIfExists(id)) != null ? _a : themeRegistry.get("dark");
  return theme.build();
}
function getBuiltInThemes(includeExtras) {
  return themeRegistry.list().filter((item) => {
    return includeExtras ? true : !item.isExtra;
  });
}
const themeRegistry = new Registry(() => {
  return [
    { id: "system", name: "System preference", build: getSystemPreferenceTheme },
    { id: "dark", name: "Dark", build: () => createTheme({ colors: { mode: "dark" } }) },
    { id: "light", name: "Light", build: () => createTheme({ colors: { mode: "light" } }) },
    { id: "blue-night", name: "Blue night", build: createBlueNight, isExtra: true },
    { id: "midnight", name: "Midnight", build: createMidnight, isExtra: true }
  ];
});
function getSystemPreferenceTheme() {
  const mediaResult = window.matchMedia("(prefers-color-scheme: dark)");
  const id = mediaResult.matches ? "dark" : "light";
  return getThemeById(id);
}
function createMidnight() {
  const whiteBase = "204, 204, 220";
  return createTheme({
    name: "Midnight",
    colors: {
      mode: "dark",
      background: {
        canvas: "#000000",
        primary: "#000000",
        secondary: "#181818"
      },
      border: {
        weak: `rgba(${whiteBase}, 0.17)`,
        medium: `rgba(${whiteBase}, 0.25)`,
        strong: `rgba(${whiteBase}, 0.35)`
      }
    }
  });
}
function createBlueNight() {
  return createTheme({
    name: "Blue night",
    colors: {
      mode: "dark",
      background: {
        canvas: "#15161d",
        primary: "#15161d",
        secondary: "#1d1f2e"
      },
      border: {
        weak: `#2e304f`,
        medium: `#2e304f`,
        strong: `#2e304f`
      }
    }
  });
}

export { getBuiltInThemes, getThemeById };
//# sourceMappingURL=registry.js.map
