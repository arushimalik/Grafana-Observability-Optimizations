var EventsWithValidation = /* @__PURE__ */ ((EventsWithValidation2) => {
  EventsWithValidation2["onBlur"] = "onBlur";
  EventsWithValidation2["onFocus"] = "onFocus";
  EventsWithValidation2["onChange"] = "onChange";
  return EventsWithValidation2;
})(EventsWithValidation || {});
const validate = (value, validationRules) => {
  const errors = validationRules.reduce((acc, currRule) => {
    if (!currRule.rule(value)) {
      return acc.concat(currRule.errorMessage);
    }
    return acc;
  }, []);
  return errors.length > 0 ? errors : null;
};
const hasValidationEvent = (event, validationEvents) => {
  return validationEvents && validationEvents[event];
};
const regexValidation = (pattern, errorMessage) => {
  return {
    rule: (valueToValidate) => {
      return !!valueToValidate.match(pattern);
    },
    errorMessage: errorMessage || "Value is not valid"
  };
};

export { EventsWithValidation, hasValidationEvent, regexValidation, validate };
//# sourceMappingURL=validate.js.map
