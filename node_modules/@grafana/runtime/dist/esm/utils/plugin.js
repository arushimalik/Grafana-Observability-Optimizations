import { config } from '../config.js';

async function loadPluginCss(options) {
  try {
    const cssPath = config.bootData.user.theme === "light" ? options.light : options.dark;
    return window.System.import(cssPath);
  } catch (err) {
    console.error(err);
  }
}
let pluginImportUtils;
function setPluginImportUtils(utils) {
  if (pluginImportUtils) {
    throw new Error("pluginImportUtils should only be set once, when Grafana is starting.");
  }
  pluginImportUtils = utils;
}
function getPluginImportUtils() {
  if (!pluginImportUtils) {
    throw new Error("pluginImportUtils can only be used after Grafana instance has started.");
  }
  return pluginImportUtils;
}

export { getPluginImportUtils, loadPluginCss, setPluginImportUtils };
//# sourceMappingURL=plugin.js.map
