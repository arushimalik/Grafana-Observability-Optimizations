import { map } from 'rxjs/operators';
import { TIME_SERIES_VALUE_FIELD_NAME } from '../../types/dataFrame.js';
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
const concatenateTransformer = {
  id: DataTransformerID.concatenate,
  name: "Concatenate fields",
  description: "Combine all fields into a single frame.  Values will be appended with undefined values if not the same length.",
  defaultOptions: {
    frameNameMode: "field" /* FieldName */,
    frameNameLabel: "frame"
  },
  operator: (options) => (source) => source.pipe(
    map((dataFrames) => {
      if (!Array.isArray(dataFrames) || dataFrames.length < 2) {
        return dataFrames;
      }
      return [concatenateFields(dataFrames, options)];
    })
  )
};
function concatenateFields(data, opts) {
  var _a;
  let sameLength = true;
  let maxLength = data[0].length;
  const frameNameLabel = (_a = opts.frameNameLabel) != null ? _a : "frame";
  let fields = [];
  for (const frame of data) {
    if (maxLength !== frame.length) {
      sameLength = false;
      maxLength = Math.max(maxLength, frame.length);
    }
    for (const f of frame.fields) {
      const copy = __spreadValues({}, f);
      copy.state = void 0;
      if (frame.name) {
        if (opts.frameNameMode === "drop" /* Drop */) ; else if (opts.frameNameMode === "label" /* Label */) {
          copy.labels = __spreadValues({}, f.labels);
          copy.labels[frameNameLabel] = frame.name;
        } else if (!copy.name || copy.name === TIME_SERIES_VALUE_FIELD_NAME) {
          copy.name = frame.name;
        } else {
          copy.name = `${frame.name} \xB7 ${f.name}`;
        }
      }
      fields.push(copy);
    }
  }
  if (!sameLength) {
    fields = fields.map((f) => {
      if (f.values.length === maxLength) {
        return f;
      }
      const values = f.values.slice();
      values.length = maxLength;
      return __spreadProps(__spreadValues({}, f), {
        values
      });
    });
  }
  return {
    fields,
    length: maxLength
  };
}

export { concatenateFields, concatenateTransformer };
//# sourceMappingURL=concat.js.map
