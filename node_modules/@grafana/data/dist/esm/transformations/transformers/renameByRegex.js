import { map } from 'rxjs/operators';
import { getFieldDisplayName } from '../../field/fieldState.js';
import { stringToJsRegex } from '../../text/string.js';
import { DataTransformerID } from './ids.js';

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
const renameByRegexTransformer = {
  id: DataTransformerID.renameByRegex,
  name: "Rename fields by regex",
  description: "Rename fields based on regular expression by users.",
  defaultOptions: {
    regex: "(.*)",
    renamePattern: "$1"
  },
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options) => (source) => source.pipe(
    map((data) => {
      if (!Array.isArray(data) || data.length === 0) {
        return data;
      }
      return data.map(renameFieldsByRegex(options));
    })
  )
};
const renameFieldsByRegex = (options) => (frame) => {
  const regex = stringToJsRegex(options.regex);
  const fields = frame.fields.map((field) => {
    const displayName = getFieldDisplayName(field, frame);
    if (!regex.test(displayName)) {
      return field;
    }
    const newDisplayName = displayName.replace(regex, options.renamePattern);
    return __spreadProps(__spreadValues({}, field), {
      config: __spreadProps(__spreadValues({}, field.config), { displayName: newDisplayName }),
      state: __spreadProps(__spreadValues({}, field.state), { displayName: newDisplayName })
    });
  });
  return __spreadProps(__spreadValues({}, frame), { fields });
};

export { renameByRegexTransformer };
//# sourceMappingURL=renameByRegex.js.map
