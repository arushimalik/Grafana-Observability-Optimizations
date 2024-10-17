function isSystemOverrideWithRef(ref) {
  return (override) => {
    return "__systemRef" in override && override.__systemRef === ref;
  };
}
const isSystemOverride = (override) => {
  return "__systemRef" in override && typeof override.__systemRef === "string";
};
var FieldConfigProperty = /* @__PURE__ */ ((FieldConfigProperty2) => {
  FieldConfigProperty2["Unit"] = "unit";
  FieldConfigProperty2["Min"] = "min";
  FieldConfigProperty2["Max"] = "max";
  FieldConfigProperty2["Decimals"] = "decimals";
  FieldConfigProperty2["DisplayName"] = "displayName";
  FieldConfigProperty2["NoValue"] = "noValue";
  FieldConfigProperty2["Thresholds"] = "thresholds";
  FieldConfigProperty2["Mappings"] = "mappings";
  FieldConfigProperty2["Links"] = "links";
  FieldConfigProperty2["Color"] = "color";
  FieldConfigProperty2["Filterable"] = "filterable";
  return FieldConfigProperty2;
})(FieldConfigProperty || {});

export { FieldConfigProperty, isSystemOverride, isSystemOverrideWithRef };
//# sourceMappingURL=fieldOverrides.js.map
