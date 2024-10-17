const transformationsVariableSupport = () => {
  var _a, _b, _c;
  return (_c = (_b = (_a = window == null ? void 0 : window.grafanaBootData) == null ? void 0 : _a.settings) == null ? void 0 : _b.featureToggles) == null ? void 0 : _c.transformationsVariableSupport;
};
function findMaxFields(data) {
  let maxFields = 0;
  for (const frame of data) {
    if (frame.fields.length > maxFields) {
      maxFields = frame.fields.length;
    }
  }
  return maxFields;
}

export { findMaxFields, transformationsVariableSupport };
//# sourceMappingURL=utils.js.map
