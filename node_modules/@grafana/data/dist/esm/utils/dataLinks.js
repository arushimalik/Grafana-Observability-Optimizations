import { locationUtil } from './location.js';
import { serializeStateToUrlParam, toURLRange } from './url.js';

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
const DataLinkBuiltInVars = {
  keepTime: "__url_time_range",
  timeRangeFrom: "__from",
  timeRangeTo: "__to",
  includeVars: "__all_variables",
  seriesName: "__series.name",
  fieldName: "__field.name",
  valueTime: "__value.time",
  valueNumeric: "__value.numeric",
  valueText: "__value.text",
  valueRaw: "__value.raw",
  // name of the calculation represented by the value
  valueCalc: "__value.calc"
};
function mapInternalLinkToExplore(options) {
  var _a, _b, _c, _d;
  const { onClickFn, replaceVariables, link, scopedVars, range, field, internalLink } = options;
  const interpolatedQuery = interpolateObject((_a = link.internal) == null ? void 0 : _a.query, scopedVars, replaceVariables);
  const interpolatedPanelsState = interpolateObject((_b = link.internal) == null ? void 0 : _b.panelsState, scopedVars, replaceVariables);
  const interpolatedCorrelationData = interpolateObject(
    (_d = (_c = link.internal) == null ? void 0 : _c.meta) == null ? void 0 : _d.correlationData,
    scopedVars,
    replaceVariables
  );
  const title = link.title ? link.title : internalLink.datasourceName;
  return {
    title: replaceVariables(title, scopedVars),
    // In this case this is meant to be internal link (opens split view by default) the href will also points
    // to explore but this way you can open it in new tab.
    href: generateInternalHref(internalLink.datasourceUid, interpolatedQuery, range, interpolatedPanelsState),
    onClick: onClickFn ? (event) => {
      if (event.preventDefault) {
        event.preventDefault();
      }
      onClickFn({
        datasourceUid: internalLink.datasourceUid,
        queries: [interpolatedQuery],
        panelsState: interpolatedPanelsState,
        correlationHelperData: interpolatedCorrelationData,
        range
      });
    } : void 0,
    target: (link == null ? void 0 : link.targetBlank) ? "_blank" : "_self",
    origin: field
  };
}
function generateInternalHref(datasourceUid, query, range, panelsState) {
  return locationUtil.assureBaseUrl(
    `/explore?left=${encodeURIComponent(
      serializeStateToUrlParam(__spreadProps(__spreadValues({}, (range == null ? void 0 : range.raw) ? { range: toURLRange(range.raw) } : {}), {
        datasource: datasourceUid,
        queries: [query],
        panelsState
      }))
    )}`
  );
}
function interpolateObject(obj, scopedVars, replaceVariables) {
  if (!obj) {
    return obj;
  }
  if (typeof obj === "string") {
    return replaceVariables(obj, scopedVars);
  }
  const copy = JSON.parse(JSON.stringify(obj));
  return interpolateObjectRecursive(copy, scopedVars, replaceVariables);
}
function interpolateObjectRecursive(obj, scopedVars, replaceVariables) {
  for (const k of Object.keys(obj)) {
    if (typeof obj[k] === "string") {
      obj[k] = replaceVariables(obj[k], scopedVars);
    } else if (typeof obj[k] === "object" && obj[k] !== null) {
      obj[k] = interpolateObjectRecursive(obj[k], scopedVars, replaceVariables);
    }
  }
  return obj;
}

export { DataLinkBuiltInVars, mapInternalLinkToExplore };
//# sourceMappingURL=dataLinks.js.map
