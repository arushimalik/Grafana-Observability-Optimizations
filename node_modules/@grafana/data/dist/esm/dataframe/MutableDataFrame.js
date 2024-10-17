import { isString } from 'lodash';
import { FieldType } from '../types/dataFrame.js';
import { makeFieldParser } from '../utils/fieldParser.js';
import { FunctionalVector } from '../vector/FunctionalVector.js';
import { guessFieldTypeFromValue, guessFieldTypeForField, toDataFrameDTO } from './processDataFrame.js';

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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const MISSING_VALUE = void 0;
class MutableDataFrame extends FunctionalVector {
  constructor(source, creator) {
    super();
    __publicField(this, "name");
    __publicField(this, "refId");
    __publicField(this, "meta");
    __publicField(this, "fields", []);
    __publicField(this, "first", []);
    __publicField(this, "creator");
    __publicField(this, "parsers");
    this.creator = creator ? creator : (buffer) => {
      return buffer != null ? buffer : [];
    };
    if (source) {
      const { name, refId, meta, fields } = source;
      if (name) {
        this.name = name;
      }
      if (refId) {
        this.refId = refId;
      }
      if (meta) {
        this.meta = meta;
      }
      if (fields) {
        for (const f of fields) {
          this.addField(f);
        }
      }
    }
    Object.defineProperty(this, "length", {
      enumerable: true,
      get: () => {
        return this.first.length;
      }
    });
  }
  // Defined for Vector interface
  get length() {
    return this.first.length;
  }
  addFieldFor(value, name) {
    return this.addField({
      name: name || "",
      // Will be filled in
      type: guessFieldTypeFromValue(value)
    });
  }
  addField(f, startLength) {
    let buffer = void 0;
    if (f.values) {
      buffer = f.values;
    }
    let type = f.type;
    if (!type && ("time" === f.name || "Time" === f.name)) {
      type = FieldType.time;
    } else {
      if (!type && buffer && buffer.length) {
        type = guessFieldTypeFromValue(buffer[0]);
      }
      if (!type) {
        type = FieldType.other;
      }
    }
    let name = f.name;
    if (!name) {
      name = `Field ${this.fields.length + 1}`;
    }
    const field = __spreadProps(__spreadValues({}, f), {
      name,
      type,
      config: f.config || {},
      values: this.creator(buffer)
    });
    if (type === FieldType.other) {
      type = guessFieldTypeForField(field);
      if (type) {
        field.type = type;
      }
    }
    this.fields.push(field);
    this.first = this.fields[0].values;
    if (startLength) {
      while (field.values.length < startLength) {
        field.values.push(MISSING_VALUE);
      }
    } else {
      this.validate();
    }
    return field;
  }
  validate() {
    const length = this.fields.reduce((v, f) => {
      return Math.max(v, f.values.length);
    }, 0);
    for (const field of this.fields) {
      while (field.values.length !== length) {
        field.values.push(MISSING_VALUE);
      }
    }
  }
  /**
   * @deprecated unclear if this is actually used
   */
  setParser(field, parser) {
    if (!this.parsers) {
      this.parsers = /* @__PURE__ */ new Map();
    }
    this.parsers.set(field, parser);
    return parser;
  }
  parseValue(field, v) {
    var _a;
    let p = (_a = this.parsers) == null ? void 0 : _a.get(field);
    if (!p) {
      p = this.setParser(field, makeFieldParser(v, field));
    }
    return p(v);
  }
  /**
   * This will add each value to the corresponding column
   */
  appendRow(row) {
    for (let i = this.fields.length; i < row.length; i++) {
      this.addField({
        name: `Field ${i + 1}`,
        type: guessFieldTypeFromValue(row[i])
      });
    }
    if (this.length < 1) {
      for (let i = 0; i < this.fields.length; i++) {
        const f = this.fields[i];
        if (!f.type || f.type === FieldType.other) {
          f.type = guessFieldTypeFromValue(row[i]);
        }
      }
    }
    for (let i = 0; i < this.fields.length; i++) {
      const f = this.fields[i];
      let v = row[i];
      if (f.type !== FieldType.string && isString(v)) {
        v = this.parseValue(f, v);
      }
      f.values.push(v);
    }
  }
  /** support standard array push syntax */
  push(...vals) {
    for (const v of vals) {
      this.add(v);
    }
    return this.length;
  }
  reverse() {
    for (const field of this.fields) {
      field.values.reverse();
    }
    return this;
  }
  /**
   * Add values from an object to corresponding fields. Similar to appendRow but does not create new fields.
   */
  add(value) {
    const obj = value;
    for (const field of this.fields) {
      let val = obj[field.name];
      if (field.type !== FieldType.string && isString(val)) {
        val = this.parseValue(field, val);
      }
      if (val === void 0) {
        val = MISSING_VALUE;
      }
      field.values.push(val);
    }
  }
  set(index, value) {
    if (index > this.length) {
      throw new Error("Unable to set value beyond current length");
    }
    const obj = value || {};
    for (const field of this.fields) {
      field.values[index] = obj[field.name];
    }
  }
  /**
   * Get an object with a property for each field in the DataFrame
   */
  get(idx) {
    const v = {};
    for (const field of this.fields) {
      v[field.name] = field.values[idx];
    }
    return v;
  }
  /**
   * The simplified JSON values used in JSON.stringify()
   */
  toJSON() {
    return toDataFrameDTO(this);
  }
}

export { MISSING_VALUE, MutableDataFrame };
//# sourceMappingURL=MutableDataFrame.js.map
