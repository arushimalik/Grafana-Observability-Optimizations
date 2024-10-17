const pluginVersion = "11.0.0-pre";
var SeriesMapping = /* @__PURE__ */ ((SeriesMapping2) => {
  SeriesMapping2["Auto"] = "auto";
  SeriesMapping2["Manual"] = "manual";
  return SeriesMapping2;
})(SeriesMapping || {});
var XYShowMode = /* @__PURE__ */ ((XYShowMode2) => {
  XYShowMode2["Lines"] = "lines";
  XYShowMode2["Points"] = "points";
  XYShowMode2["PointsAndLines"] = "points+lines";
  return XYShowMode2;
})(XYShowMode || {});
const defaultMatcherConfig = {
  id: ""
};
const defaultFieldConfig = {
  show: "points" /* Points */
};
const defaultOptions = {
  series: []
};

export { SeriesMapping, XYShowMode, defaultFieldConfig, defaultMatcherConfig, defaultOptions, pluginVersion };
