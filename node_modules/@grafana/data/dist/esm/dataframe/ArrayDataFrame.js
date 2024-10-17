import { FieldType, TIME_SERIES_VALUE_FIELD_NAME } from '../types/dataFrame.js';
import { guessFieldTypeForField } from './processDataFrame.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class ArrayDataFrame {
  constructor(source, names) {
    __publicField(this, "fields", []);
    __publicField(this, "length", 0);
    __publicField(this, "name");
    __publicField(this, "refId");
    __publicField(this, "meta");
    return arrayToDataFrame(source, names);
  }
}
function arrayToDataFrame(source, names) {
  const df = {
    fields: [],
    length: source.length
  };
  if (!(source == null ? void 0 : source.length)) {
    return df;
  }
  if (names) {
    if (!isObjectArray(source)) {
      throw new Error("source is not an array of objects");
    }
    for (const name of names) {
      df.fields.push(
        makeFieldFromValues(
          name,
          source.map((v) => v ? v[name] : v)
        )
      );
    }
    return df;
  }
  const firstDefined = source.find((v) => v);
  if (firstDefined === null) {
    return df;
  }
  if (isObjectArray(source)) {
    const first = source.find((v) => v);
    df.fields = Object.keys(first || {}).map((name) => {
      return makeFieldFromValues(
        name,
        source.map((v) => v ? v[name] : v)
      );
    });
  } else {
    df.fields.push(makeFieldFromValues(TIME_SERIES_VALUE_FIELD_NAME, source));
  }
  return df;
}
function makeFieldFromValues(name, values) {
  var _a;
  const f = { name, config: {}, values, type: FieldType.other };
  f.type = (_a = guessFieldTypeForField(f)) != null ? _a : FieldType.other;
  return f;
}
function isObjectArray(arr) {
  const first = arr.find((v) => v);
  return arr.length > 0 && typeof first === "object";
}

export { ArrayDataFrame, arrayToDataFrame };
//# sourceMappingURL=ArrayDataFrame.js.map
