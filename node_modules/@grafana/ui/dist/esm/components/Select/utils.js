var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const cleanValue = (value, options) => {
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    return (filtered == null ? void 0 : filtered.length) ? filtered : void 0;
  }
  if (typeof value === "object") {
    return [value];
  }
  if (typeof value === "string" || typeof value === "number") {
    const selectedValue = findSelectedValue(value, options);
    if (selectedValue) {
      return [selectedValue];
    }
  }
  return void 0;
};
const findSelectedValue = (value, options) => {
  for (const option of options) {
    if ("options" in option) {
      let found = findSelectedValue(value, option.options);
      if (found) {
        return found;
      }
    } else if ("value" in option && option.value === value) {
      return option;
    }
  }
  return null;
};
const omitDescriptions = (options) => {
  return options.map((_a) => {
    var _b = _a, rest = __objRest(_b, ["description"]);
    return rest;
  });
};

export { cleanValue, findSelectedValue, omitDescriptions };
//# sourceMappingURL=utils.js.map
