import { isPluginExtensionLink, isPluginExtensionComponent } from './utils.js';

let singleton;
function setPluginExtensionGetter(instance) {
  if (singleton && process.env.NODE_ENV !== "test") {
    throw new Error("setPluginExtensionGetter() function should only be called once, when Grafana is starting.");
  }
  singleton = instance;
}
function getPluginExtensionGetter() {
  if (!singleton) {
    throw new Error("getPluginExtensionGetter() can only be used after the Grafana instance has started.");
  }
  return singleton;
}
const getPluginExtensions = (options) => getPluginExtensionGetter()(options);
const getPluginLinkExtensions = (options) => {
  const { extensions } = getPluginExtensions(options);
  return {
    extensions: extensions.filter(isPluginExtensionLink)
  };
};
const getPluginComponentExtensions = (options) => {
  const { extensions } = getPluginExtensions(options);
  const componentExtensions = extensions.filter(isPluginExtensionComponent);
  return {
    extensions: componentExtensions
  };
};

export { getPluginComponentExtensions, getPluginExtensions, getPluginLinkExtensions, setPluginExtensionGetter };
//# sourceMappingURL=getPluginExtensions.js.map
