const pluginVersion = "%VERSION%";
var QueryType = /* @__PURE__ */ ((QueryType2) => {
  QueryType2["ANNOTATION"] = "annotation";
  QueryType2["PROMQL"] = "promQL";
  QueryType2["SLO"] = "slo";
  QueryType2["TIME_SERIES_LIST"] = "timeSeriesList";
  QueryType2["TIME_SERIES_QUERY"] = "timeSeriesQuery";
  return QueryType2;
})(QueryType || {});
const defaultTimeSeriesList = {
  filters: [],
  groupBys: [],
  secondaryGroupBys: []
};
var PreprocessorType = /* @__PURE__ */ ((PreprocessorType2) => {
  PreprocessorType2["Delta"] = "delta";
  PreprocessorType2["None"] = "none";
  PreprocessorType2["Rate"] = "rate";
  return PreprocessorType2;
})(PreprocessorType || {});
const defaultMetricQuery = {
  filters: [],
  groupBys: []
};
var MetricKind = /* @__PURE__ */ ((MetricKind2) => {
  MetricKind2["CUMULATIVE"] = "CUMULATIVE";
  MetricKind2["DELTA"] = "DELTA";
  MetricKind2["GAUGE"] = "GAUGE";
  MetricKind2["METRIC_KIND_UNSPECIFIED"] = "METRIC_KIND_UNSPECIFIED";
  return MetricKind2;
})(MetricKind || {});
var ValueTypes = /* @__PURE__ */ ((ValueTypes2) => {
  ValueTypes2["BOOL"] = "BOOL";
  ValueTypes2["DISTRIBUTION"] = "DISTRIBUTION";
  ValueTypes2["DOUBLE"] = "DOUBLE";
  ValueTypes2["INT64"] = "INT64";
  ValueTypes2["MONEY"] = "MONEY";
  ValueTypes2["STRING"] = "STRING";
  ValueTypes2["VALUE_TYPE_UNSPECIFIED"] = "VALUE_TYPE_UNSPECIFIED";
  return ValueTypes2;
})(ValueTypes || {});
var AlignmentTypes = /* @__PURE__ */ ((AlignmentTypes2) => {
  AlignmentTypes2["ALIGN_COUNT"] = "ALIGN_COUNT";
  AlignmentTypes2["ALIGN_COUNT_FALSE"] = "ALIGN_COUNT_FALSE";
  AlignmentTypes2["ALIGN_COUNT_TRUE"] = "ALIGN_COUNT_TRUE";
  AlignmentTypes2["ALIGN_DELTA"] = "ALIGN_DELTA";
  AlignmentTypes2["ALIGN_FRACTION_TRUE"] = "ALIGN_FRACTION_TRUE";
  AlignmentTypes2["ALIGN_INTERPOLATE"] = "ALIGN_INTERPOLATE";
  AlignmentTypes2["ALIGN_MAX"] = "ALIGN_MAX";
  AlignmentTypes2["ALIGN_MEAN"] = "ALIGN_MEAN";
  AlignmentTypes2["ALIGN_MIN"] = "ALIGN_MIN";
  AlignmentTypes2["ALIGN_NEXT_OLDER"] = "ALIGN_NEXT_OLDER";
  AlignmentTypes2["ALIGN_NONE"] = "ALIGN_NONE";
  AlignmentTypes2["ALIGN_PERCENTILE_05"] = "ALIGN_PERCENTILE_05";
  AlignmentTypes2["ALIGN_PERCENTILE_50"] = "ALIGN_PERCENTILE_50";
  AlignmentTypes2["ALIGN_PERCENTILE_95"] = "ALIGN_PERCENTILE_95";
  AlignmentTypes2["ALIGN_PERCENTILE_99"] = "ALIGN_PERCENTILE_99";
  AlignmentTypes2["ALIGN_PERCENT_CHANGE"] = "ALIGN_PERCENT_CHANGE";
  AlignmentTypes2["ALIGN_RATE"] = "ALIGN_RATE";
  AlignmentTypes2["ALIGN_STDDEV"] = "ALIGN_STDDEV";
  AlignmentTypes2["ALIGN_SUM"] = "ALIGN_SUM";
  return AlignmentTypes2;
})(AlignmentTypes || {});
const defaultLegacyCloudMonitoringAnnotationQuery = {
  filters: []
};
var MetricFindQueryTypes = /* @__PURE__ */ ((MetricFindQueryTypes2) => {
  MetricFindQueryTypes2["Aggregations"] = "aggregations";
  MetricFindQueryTypes2["Aligners"] = "aligners";
  MetricFindQueryTypes2["AlignmentPeriods"] = "alignmentPeriods";
  MetricFindQueryTypes2["DefaultProject"] = "defaultProject";
  MetricFindQueryTypes2["LabelKeys"] = "labelKeys";
  MetricFindQueryTypes2["LabelValues"] = "labelValues";
  MetricFindQueryTypes2["MetricTypes"] = "metricTypes";
  MetricFindQueryTypes2["Projects"] = "projects";
  MetricFindQueryTypes2["ResourceTypes"] = "resourceTypes";
  MetricFindQueryTypes2["SLO"] = "slo";
  MetricFindQueryTypes2["SLOServices"] = "sloServices";
  MetricFindQueryTypes2["Selectors"] = "selectors";
  MetricFindQueryTypes2["Services"] = "services";
  return MetricFindQueryTypes2;
})(MetricFindQueryTypes || {});

export { AlignmentTypes, MetricFindQueryTypes, MetricKind, PreprocessorType, QueryType, ValueTypes, defaultLegacyCloudMonitoringAnnotationQuery, defaultMetricQuery, defaultTimeSeriesList, pluginVersion };
