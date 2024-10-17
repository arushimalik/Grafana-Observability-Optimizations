const identityOverrideProcessor = (value) => {
  return value;
};
const numberOverrideProcessor = (value, context, settings) => {
  if (value === void 0 || value === null) {
    return void 0;
  }
  return parseFloat(value);
};
const displayNameOverrideProcessor = (value, context, settings) => {
  var _a, _b;
  (_b = (_a = context.field) == null ? void 0 : _a.state) == null ? true : delete _b.displayName;
  return stringOverrideProcessor(value, context, settings);
};
const dataLinksOverrideProcessor = (value, _context, _settings) => {
  return value;
};
const valueMappingsOverrideProcessor = (value, _context, _settings) => {
  return value;
};
const selectOverrideProcessor = (value, _context, _settings) => {
  return value;
};
const stringOverrideProcessor = (value, context, settings) => {
  if (value === null || value === void 0) {
    return value;
  }
  if (settings && settings.expandTemplateVars && context.replaceVariables && typeof value === "string") {
    return context.replaceVariables(value, context.field.state.scopedVars);
  }
  return `${value}`;
};
const thresholdsOverrideProcessor = (value, _context, _settings) => {
  return value;
};
const unitOverrideProcessor = (value, _context, _settings) => {
  return value;
};
const booleanOverrideProcessor = (value, _context, _settings) => {
  return value;
};
var FieldNamePickerBaseNameMode = /* @__PURE__ */ ((FieldNamePickerBaseNameMode2) => {
  FieldNamePickerBaseNameMode2["IncludeAll"] = "all";
  FieldNamePickerBaseNameMode2["ExcludeBaseNames"] = "exclude";
  FieldNamePickerBaseNameMode2["OnlyBaseNames"] = "only";
  return FieldNamePickerBaseNameMode2;
})(FieldNamePickerBaseNameMode || {});

export { FieldNamePickerBaseNameMode, booleanOverrideProcessor, dataLinksOverrideProcessor, displayNameOverrideProcessor, identityOverrideProcessor, numberOverrideProcessor, selectOverrideProcessor, stringOverrideProcessor, thresholdsOverrideProcessor, unitOverrideProcessor, valueMappingsOverrideProcessor };
//# sourceMappingURL=processors.js.map
