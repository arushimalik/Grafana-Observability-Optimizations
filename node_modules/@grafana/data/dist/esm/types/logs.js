export { LogsDedupStrategy, LogsSortOrder } from '@grafana/schema';

var LogLevel = /* @__PURE__ */ ((LogLevel2) => {
  LogLevel2["emerg"] = "critical";
  LogLevel2["fatal"] = "critical";
  LogLevel2["alert"] = "critical";
  LogLevel2["crit"] = "critical";
  LogLevel2["critical"] = "critical";
  LogLevel2["warn"] = "warning";
  LogLevel2["warning"] = "warning";
  LogLevel2["err"] = "error";
  LogLevel2["eror"] = "error";
  LogLevel2["error"] = "error";
  LogLevel2["info"] = "info";
  LogLevel2["information"] = "info";
  LogLevel2["informational"] = "info";
  LogLevel2["notice"] = "info";
  LogLevel2["dbug"] = "debug";
  LogLevel2["debug"] = "debug";
  LogLevel2["trace"] = "trace";
  LogLevel2["unknown"] = "unknown";
  return LogLevel2;
})(LogLevel || {});
const NumericLogLevel = {
  "0": "critical" /* critical */,
  "1": "critical" /* critical */,
  "2": "critical" /* critical */,
  "3": "error" /* error */,
  "4": "warning" /* warning */,
  "5": "info" /* info */,
  "6": "info" /* info */,
  "7": "debug" /* debug */
};
var LogsMetaKind = /* @__PURE__ */ ((LogsMetaKind2) => {
  LogsMetaKind2[LogsMetaKind2["Number"] = 0] = "Number";
  LogsMetaKind2[LogsMetaKind2["String"] = 1] = "String";
  LogsMetaKind2[LogsMetaKind2["LabelsMap"] = 2] = "LabelsMap";
  LogsMetaKind2[LogsMetaKind2["Error"] = 3] = "Error";
  return LogsMetaKind2;
})(LogsMetaKind || {});
var LogsDedupDescription = /* @__PURE__ */ ((LogsDedupDescription2) => {
  LogsDedupDescription2["none"] = "No de-duplication";
  LogsDedupDescription2["exact"] = "De-duplication of successive lines that are identical, ignoring ISO datetimes.";
  LogsDedupDescription2["numbers"] = "De-duplication of successive lines that are identical when ignoring numbers, e.g., IP addresses, latencies.";
  LogsDedupDescription2["signature"] = "De-duplication of successive lines that have identical punctuation and whitespace.";
  return LogsDedupDescription2;
})(LogsDedupDescription || {});
var LogRowContextQueryDirection = /* @__PURE__ */ ((LogRowContextQueryDirection2) => {
  LogRowContextQueryDirection2["Backward"] = "BACKWARD";
  LogRowContextQueryDirection2["Forward"] = "FORWARD";
  return LogRowContextQueryDirection2;
})(LogRowContextQueryDirection || {});
const hasLogsContextSupport = (datasource) => {
  if (!datasource || typeof datasource !== "object") {
    return false;
  }
  return "getLogRowContext" in datasource;
};
var SupplementaryQueryType = /* @__PURE__ */ ((SupplementaryQueryType2) => {
  SupplementaryQueryType2["LogsVolume"] = "LogsVolume";
  SupplementaryQueryType2["LogsSample"] = "LogsSample";
  return SupplementaryQueryType2;
})(SupplementaryQueryType || {});
var LogsVolumeType = /* @__PURE__ */ ((LogsVolumeType2) => {
  LogsVolumeType2["FullRange"] = "FullRange";
  LogsVolumeType2["Limited"] = "Limited";
  return LogsVolumeType2;
})(LogsVolumeType || {});
const hasSupplementaryQuerySupport = (datasource, type) => {
  if (!datasource) {
    return false;
  }
  return ("getDataProvider" in datasource || "getSupplementaryRequest" in datasource) && "getSupplementaryQuery" in datasource && "getSupportedSupplementaryQueryTypes" in datasource && datasource.getSupportedSupplementaryQueryTypes().includes(type);
};
const hasLogsContextUiSupport = (datasource) => {
  if (!datasource || typeof datasource !== "object") {
    return false;
  }
  return "getLogRowContextUi" in datasource;
};
const hasToggleableQueryFiltersSupport = (datasource) => {
  return datasource != null && typeof datasource === "object" && "toggleQueryFilter" in datasource && "queryHasFilter" in datasource;
};
const hasQueryModificationSupport = (datasource) => {
  return datasource != null && typeof datasource === "object" && "modifyQuery" in datasource && "getSupportedQueryModifications" in datasource;
};

export { LogLevel, LogRowContextQueryDirection, LogsDedupDescription, LogsMetaKind, LogsVolumeType, NumericLogLevel, SupplementaryQueryType, hasLogsContextSupport, hasLogsContextUiSupport, hasQueryModificationSupport, hasSupplementaryQuerySupport, hasToggleableQueryFiltersSupport };
//# sourceMappingURL=logs.js.map
