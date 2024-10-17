import { PluginExtensionTypes } from '@grafana/data';

function isPluginExtensionLink(extension) {
  if (!extension) {
    return false;
  }
  return extension.type === PluginExtensionTypes.link && ("path" in extension || "onClick" in extension);
}
function isPluginExtensionComponent(extension) {
  if (!extension) {
    return false;
  }
  return extension.type === PluginExtensionTypes.component && "component" in extension;
}

export { isPluginExtensionComponent, isPluginExtensionLink };
//# sourceMappingURL=utils.js.map
