var MatcherID = /* @__PURE__ */ ((MatcherID2) => {
  MatcherID2["anyMatch"] = "anyMatch";
  MatcherID2["allMatch"] = "allMatch";
  MatcherID2["invertMatch"] = "invertMatch";
  MatcherID2["alwaysMatch"] = "alwaysMatch";
  MatcherID2["neverMatch"] = "neverMatch";
  return MatcherID2;
})(MatcherID || {});
var FieldMatcherID = /* @__PURE__ */ ((FieldMatcherID2) => {
  FieldMatcherID2["numeric"] = "numeric";
  FieldMatcherID2["time"] = "time";
  FieldMatcherID2["first"] = "first";
  FieldMatcherID2["firstTimeField"] = "firstTimeField";
  FieldMatcherID2["byType"] = "byType";
  FieldMatcherID2["byTypes"] = "byTypes";
  FieldMatcherID2["byName"] = "byName";
  FieldMatcherID2["byNames"] = "byNames";
  FieldMatcherID2["byRegexp"] = "byRegexp";
  FieldMatcherID2["byRegexpOrNames"] = "byRegexpOrNames";
  FieldMatcherID2["byFrameRefID"] = "byFrameRefID";
  FieldMatcherID2["byValue"] = "byValue";
  return FieldMatcherID2;
})(FieldMatcherID || {});
var FrameMatcherID = /* @__PURE__ */ ((FrameMatcherID2) => {
  FrameMatcherID2["byName"] = "byName";
  FrameMatcherID2["byRefId"] = "byRefId";
  FrameMatcherID2["byIndex"] = "byIndex";
  return FrameMatcherID2;
})(FrameMatcherID || {});
var ValueMatcherID = /* @__PURE__ */ ((ValueMatcherID2) => {
  ValueMatcherID2["regex"] = "regex";
  ValueMatcherID2["isNull"] = "isNull";
  ValueMatcherID2["isNotNull"] = "isNotNull";
  ValueMatcherID2["greater"] = "greater";
  ValueMatcherID2["greaterOrEqual"] = "greaterOrEqual";
  ValueMatcherID2["lower"] = "lower";
  ValueMatcherID2["lowerOrEqual"] = "lowerOrEqual";
  ValueMatcherID2["equal"] = "equal";
  ValueMatcherID2["notEqual"] = "notEqual";
  ValueMatcherID2["substring"] = "substring";
  ValueMatcherID2["notSubstring"] = "notSubstring";
  ValueMatcherID2["between"] = "between";
  return ValueMatcherID2;
})(ValueMatcherID || {});

export { FieldMatcherID, FrameMatcherID, MatcherID, ValueMatcherID };
//# sourceMappingURL=ids.js.map
