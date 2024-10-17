import { GrafanaPlugin, PluginIncludeType } from './plugin.js';
import { PluginExtensionTypes } from './pluginExtensions.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var CoreApp = /* @__PURE__ */ ((CoreApp2) => {
  CoreApp2["CloudAlerting"] = "cloud-alerting";
  CoreApp2["UnifiedAlerting"] = "unified-alerting";
  CoreApp2["Dashboard"] = "dashboard";
  CoreApp2["Explore"] = "explore";
  CoreApp2["Correlations"] = "correlations";
  CoreApp2["Unknown"] = "unknown";
  CoreApp2["PanelEditor"] = "panel-editor";
  CoreApp2["PanelViewer"] = "panel-viewer";
  return CoreApp2;
})(CoreApp || {});
class AppPlugin extends GrafanaPlugin {
  constructor() {
    super(...arguments);
    __publicField(this, "_extensionConfigs", []);
    // Content under: /a/${plugin-id}/*
    __publicField(this, "root");
  }
  /**
   * Called after the module has loaded, and before the app is used.
   * This function may be called multiple times on the same instance.
   * The first time, `this.meta` will be undefined
   */
  init(meta) {
  }
  /**
   * Set the component displayed under:
   *   /a/${plugin-id}/*
   *
   * If the NavModel is configured, the page will have a managed frame, otheriwse it has full control.
   */
  setRootPage(root) {
    this.root = root;
    return this;
  }
  setComponentsFromLegacyExports(pluginExports) {
    if (pluginExports.ConfigCtrl) {
      this.angularConfigCtrl = pluginExports.ConfigCtrl;
    }
    if (this.meta && this.meta.includes) {
      for (const include of this.meta.includes) {
        if (include.type === PluginIncludeType.page && include.component) {
          const exp = pluginExports[include.component];
          if (!exp) {
            console.warn("App Page uses unknown component: ", include.component, this.meta);
            continue;
          }
        }
      }
    }
  }
  get extensionConfigs() {
    return this._extensionConfigs;
  }
  addLink(extensionConfig) {
    const _a = extensionConfig, { targets } = _a, extension = __objRest(_a, ["targets"]);
    const targetsArray = Array.isArray(targets) ? targets : [targets];
    targetsArray.forEach((target) => {
      this._extensionConfigs.push(__spreadProps(__spreadValues({}, extension), {
        extensionPointId: target,
        type: PluginExtensionTypes.link
      }));
    });
    return this;
  }
  addComponent(extensionConfig) {
    const _a = extensionConfig, { targets } = _a, extension = __objRest(_a, ["targets"]);
    const targetsArray = Array.isArray(targets) ? targets : [targets];
    targetsArray.forEach((target) => {
      this._extensionConfigs.push(__spreadProps(__spreadValues({}, extension), {
        extensionPointId: target,
        type: PluginExtensionTypes.component
      }));
    });
    return this;
  }
  exposeComponent(componentConfig) {
    const _a = componentConfig, { id } = _a, extension = __objRest(_a, ["id"]);
    this._extensionConfigs.push(__spreadProps(__spreadValues({}, extension), {
      extensionPointId: `capabilities/${id}`,
      type: PluginExtensionTypes.component
    }));
    return this;
  }
  /** @deprecated Use .addLink() instead */
  configureExtensionLink(extension) {
    this.addLink(__spreadValues({
      targets: [extension.extensionPointId]
    }, extension));
    return this;
  }
  /** @deprecated Use .addComponent() instead */
  configureExtensionComponent(extension) {
    this.addComponent(__spreadValues({
      targets: [extension.extensionPointId]
    }, extension));
    return this;
  }
}
var FeatureState = /* @__PURE__ */ ((FeatureState2) => {
  FeatureState2["alpha"] = "alpha";
  FeatureState2["beta"] = "beta";
  FeatureState2["experimental"] = "experimental";
  FeatureState2["privatePreview"] = "private preview";
  FeatureState2["preview"] = "preview";
  return FeatureState2;
})(FeatureState || {});

export { AppPlugin, CoreApp, FeatureState };
//# sourceMappingURL=app.js.map
