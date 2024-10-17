var TransformationApplicabilityLevels = /* @__PURE__ */ ((TransformationApplicabilityLevels2) => {
  TransformationApplicabilityLevels2[TransformationApplicabilityLevels2["NotPossible"] = -1] = "NotPossible";
  TransformationApplicabilityLevels2[TransformationApplicabilityLevels2["NotApplicable"] = 0] = "NotApplicable";
  TransformationApplicabilityLevels2[TransformationApplicabilityLevels2["Applicable"] = 1] = "Applicable";
  TransformationApplicabilityLevels2[TransformationApplicabilityLevels2["HighlyApplicable"] = 2] = "HighlyApplicable";
  return TransformationApplicabilityLevels2;
})(TransformationApplicabilityLevels || {});
var SpecialValue = /* @__PURE__ */ ((SpecialValue2) => {
  SpecialValue2["True"] = "true";
  SpecialValue2["False"] = "false";
  SpecialValue2["Null"] = "null";
  SpecialValue2["Empty"] = "empty";
  return SpecialValue2;
})(SpecialValue || {});

export { SpecialValue, TransformationApplicabilityLevels };
//# sourceMappingURL=transformations.js.map
