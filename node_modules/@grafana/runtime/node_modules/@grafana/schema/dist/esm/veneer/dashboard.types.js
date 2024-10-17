import { defaultDashboard as defaultDashboard$1, defaultVariableModel as defaultVariableModel$1, defaultTimePickerConfig as defaultTimePickerConfig$1, defaultPanel as defaultPanel$1, defaultRowPanel as defaultRowPanel$1, defaultFieldConfig as defaultFieldConfig$1, defaultFieldConfigSource as defaultFieldConfigSource$1, defaultMatcherConfig as defaultMatcherConfig$1, defaultAnnotationQuery as defaultAnnotationQuery$1, defaultAnnotationContainer as defaultAnnotationContainer$1 } from '../raw/dashboard/x/dashboard_types.gen.js';

var __defProp = Object.defineProperty;
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
var VariableHide = /* @__PURE__ */ ((VariableHide2) => {
  VariableHide2[VariableHide2["dontHide"] = 0] = "dontHide";
  VariableHide2[VariableHide2["hideLabel"] = 1] = "hideLabel";
  VariableHide2[VariableHide2["hideVariable"] = 2] = "hideVariable";
  return VariableHide2;
})(VariableHide || {});
const defaultDashboard = defaultDashboard$1;
const defaultVariableModel = __spreadValues({}, defaultVariableModel$1);
const defaultTimePickerConfig = defaultTimePickerConfig$1;
const defaultPanel = defaultPanel$1;
const defaultRowPanel = defaultRowPanel$1;
const defaultFieldConfig = defaultFieldConfig$1;
const defaultFieldConfigSource = defaultFieldConfigSource$1;
const defaultMatcherConfig = defaultMatcherConfig$1;
const defaultAnnotationQuery = defaultAnnotationQuery$1;
const defaultAnnotationContainer = defaultAnnotationContainer$1;

export { VariableHide, defaultAnnotationContainer, defaultAnnotationQuery, defaultDashboard, defaultFieldConfig, defaultFieldConfigSource, defaultMatcherConfig, defaultPanel, defaultRowPanel, defaultTimePickerConfig, defaultVariableModel };
//# sourceMappingURL=dashboard.types.js.map
