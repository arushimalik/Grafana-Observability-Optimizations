import { FieldType, isLikelyAscendingVector, sortDataFrame, applyNullInsertThreshold } from '@grafana/data';

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
function preparePlotFrame(sparkline, config) {
  var _a, _b, _c;
  const length = sparkline.y.values.length;
  const yFieldConfig = __spreadValues(__spreadValues({}, sparkline.y.config), config);
  const xField = (_a = sparkline.x) != null ? _a : {
    name: "",
    values: [...Array(length).keys()],
    type: FieldType.number,
    config: {}
  };
  let frame = {
    refId: "sparkline",
    fields: [
      xField,
      __spreadProps(__spreadValues({}, sparkline.y), {
        config: yFieldConfig
      })
    ],
    length
  };
  if (!isLikelyAscendingVector(xField.values)) {
    frame = sortDataFrame(frame, 0);
  }
  return applyNullInsertThreshold({
    frame,
    refFieldPseudoMin: (_b = sparkline.timeRange) == null ? void 0 : _b.from.valueOf(),
    refFieldPseudoMax: (_c = sparkline.timeRange) == null ? void 0 : _c.to.valueOf()
  });
}

export { preparePlotFrame };
//# sourceMappingURL=utils.js.map
