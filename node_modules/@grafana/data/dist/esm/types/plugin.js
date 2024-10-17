var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var PluginState = /* @__PURE__ */ ((PluginState2) => {
  PluginState2["alpha"] = "alpha";
  PluginState2["beta"] = "beta";
  PluginState2["stable"] = "stable";
  PluginState2["deprecated"] = "deprecated";
  return PluginState2;
})(PluginState || {});
var PluginType = /* @__PURE__ */ ((PluginType2) => {
  PluginType2["panel"] = "panel";
  PluginType2["datasource"] = "datasource";
  PluginType2["app"] = "app";
  PluginType2["renderer"] = "renderer";
  PluginType2["secretsmanager"] = "secretsmanager";
  return PluginType2;
})(PluginType || {});
var PluginSignatureStatus = /* @__PURE__ */ ((PluginSignatureStatus2) => {
  PluginSignatureStatus2["internal"] = "internal";
  PluginSignatureStatus2["valid"] = "valid";
  PluginSignatureStatus2["invalid"] = "invalid";
  PluginSignatureStatus2["modified"] = "modified";
  PluginSignatureStatus2["missing"] = "missing";
  return PluginSignatureStatus2;
})(PluginSignatureStatus || {});
var PluginSignatureType = /* @__PURE__ */ ((PluginSignatureType2) => {
  PluginSignatureType2["grafana"] = "grafana";
  PluginSignatureType2["commercial"] = "commercial";
  PluginSignatureType2["community"] = "community";
  PluginSignatureType2["private"] = "private";
  PluginSignatureType2["core"] = "core";
  return PluginSignatureType2;
})(PluginSignatureType || {});
var PluginErrorCode = /* @__PURE__ */ ((PluginErrorCode2) => {
  PluginErrorCode2["missingSignature"] = "signatureMissing";
  PluginErrorCode2["invalidSignature"] = "signatureInvalid";
  PluginErrorCode2["modifiedSignature"] = "signatureModified";
  PluginErrorCode2["failedBackendStart"] = "failedBackendStart";
  PluginErrorCode2["angular"] = "angular";
  return PluginErrorCode2;
})(PluginErrorCode || {});
var PluginIncludeType = /* @__PURE__ */ ((PluginIncludeType2) => {
  PluginIncludeType2["dashboard"] = "dashboard";
  PluginIncludeType2["page"] = "page";
  PluginIncludeType2["panel"] = "panel";
  PluginIncludeType2["datasource"] = "datasource";
  return PluginIncludeType2;
})(PluginIncludeType || {});
class GrafanaPlugin {
  constructor() {
    // Meta is filled in by the plugin loading system
    __publicField(this, "meta");
    // This is set if the plugin system had errors loading the plugin
    __publicField(this, "loadError");
    // Config control (app/datasource)
    __publicField(this, "angularConfigCtrl");
    // Show configuration tabs on the plugin page
    __publicField(this, "configPages");
    this.meta = {};
  }
  // Tabs on the plugin page
  addConfigPage(tab) {
    if (!this.configPages) {
      this.configPages = [];
    }
    this.configPages.push(tab);
    return this;
  }
  /**
   * @deprecated -- this is no longer necessary and will be removed
   */
  setChannelSupport() {
    console.warn("[deprecation] plugin is using ignored option: setChannelSupport", this.meta);
    return this;
  }
}

export { GrafanaPlugin, PluginErrorCode, PluginIncludeType, PluginSignatureStatus, PluginSignatureType, PluginState, PluginType };
//# sourceMappingURL=plugin.js.map
