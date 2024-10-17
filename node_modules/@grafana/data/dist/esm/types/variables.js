var VariableSupportType = /* @__PURE__ */ ((VariableSupportType2) => {
  VariableSupportType2["Legacy"] = "legacy";
  VariableSupportType2["Standard"] = "standard";
  VariableSupportType2["Custom"] = "custom";
  VariableSupportType2["Datasource"] = "datasource";
  return VariableSupportType2;
})(VariableSupportType || {});
class VariableSupportBase {
}
class StandardVariableSupport extends VariableSupportBase {
  getType() {
    return "standard" /* Standard */;
  }
}
class CustomVariableSupport extends VariableSupportBase {
  getType() {
    return "custom" /* Custom */;
  }
}
class DataSourceVariableSupport extends VariableSupportBase {
  getType() {
    return "datasource" /* Datasource */;
  }
}

export { CustomVariableSupport, DataSourceVariableSupport, StandardVariableSupport, VariableSupportBase, VariableSupportType };
//# sourceMappingURL=variables.js.map
