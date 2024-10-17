var LoadingState = /* @__PURE__ */ ((LoadingState2) => {
  LoadingState2["NotStarted"] = "NotStarted";
  LoadingState2["Loading"] = "Loading";
  LoadingState2["Streaming"] = "Streaming";
  LoadingState2["Done"] = "Done";
  LoadingState2["Error"] = "Error";
  return LoadingState2;
})(LoadingState || {});
const preferredVisualizationTypes = [
  "graph",
  "table",
  "logs",
  "trace",
  "nodeGraph",
  "flamegraph",
  "rawPrometheus"
];
var NullValueMode = /* @__PURE__ */ ((NullValueMode2) => {
  NullValueMode2["Null"] = "null";
  NullValueMode2["Ignore"] = "connected";
  NullValueMode2["AsZero"] = "null as zero";
  return NullValueMode2;
})(NullValueMode || {});
const isTruthy = (value) => Boolean(value);
function isObject(value) {
  if (typeof value === "object" && value !== null) {
    return true;
  }
  return false;
}

export { LoadingState, NullValueMode, isObject, isTruthy, preferredVisualizationTypes };
//# sourceMappingURL=data.js.map
