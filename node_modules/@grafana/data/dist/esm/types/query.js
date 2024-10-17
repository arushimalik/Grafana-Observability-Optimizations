export { DataTopic } from '@grafana/schema';

var AbstractLabelOperator = /* @__PURE__ */ ((AbstractLabelOperator2) => {
  AbstractLabelOperator2["Equal"] = "Equal";
  AbstractLabelOperator2["NotEqual"] = "NotEqual";
  AbstractLabelOperator2["EqualRegEx"] = "EqualRegEx";
  AbstractLabelOperator2["NotEqualRegEx"] = "NotEqualRegEx";
  return AbstractLabelOperator2;
})(AbstractLabelOperator || {});
const hasQueryImportSupport = (datasource) => {
  if (!datasource || typeof datasource !== "object") {
    return false;
  }
  return "importFromAbstractQueries" in datasource;
};
const hasQueryExportSupport = (datasource) => {
  if (!datasource || typeof datasource !== "object") {
    return false;
  }
  return "exportToAbstractQueries" in datasource;
};

export { AbstractLabelOperator, hasQueryExportSupport, hasQueryImportSupport };
//# sourceMappingURL=query.js.map
