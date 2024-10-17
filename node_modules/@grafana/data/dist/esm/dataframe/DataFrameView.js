import { FunctionalVector } from '../vector/FunctionalVector.js';

var __defProp = Object.defineProperty;
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DataFrameView extends FunctionalVector {
  constructor(data) {
    super();
    this.data = data;
    __publicField(this, "index", 0);
    __publicField(this, "obj");
    __publicField(this, "fields");
    const obj = {};
    const fields = {};
    for (let i = 0; i < data.fields.length; i++) {
      const field = data.fields[i];
      if (!field.name) {
        continue;
      }
      fields[field.name] = field;
      const getter = () => field.values.get(this.index);
      if (!obj.hasOwnProperty(field.name)) {
        Object.defineProperty(obj, field.name, {
          enumerable: true,
          // Shows up as enumerable property
          get: getter
        });
      }
      if (!obj.hasOwnProperty(i.toString())) {
        Object.defineProperty(obj, i, {
          enumerable: false,
          // Don't enumerate array index
          get: getter
        });
      }
    }
    this.obj = obj;
    this.fields = fields;
  }
  get dataFrame() {
    return this.data;
  }
  get length() {
    return this.data.length;
  }
  /**
   * Helper function to return the {@link DisplayProcessor} for a given field column.
   * @param colIndex - the field column index for the data frame.
   */
  getFieldDisplayProcessor(colIndex) {
    if (!this.dataFrame || !this.dataFrame.fields) {
      return void 0;
    }
    const field = this.dataFrame.fields[colIndex];
    if (!field || !field.display) {
      return void 0;
    }
    return field.display;
  }
  /**
   * The contents of the object returned from this function
   * are optimized for use in a loop. All calls return the same object
   * but the index has changed.
   *
   * @example
   * ```typescript
   *   // `first`, `second` and `third` will all point to the same contents at index 2:
   *   const first = view.get(0);
   *   const second = view.get(1);
   *   const third = view.get(2);
   *
   *   // If you need three different objects, consider something like:
   *   const first = { ...view.get(0) };
   *   const second = { ...view.get(1) };
   *   const third = { ...view.get(2) };
   * ```
   * @param idx - The index of the object you currently are inspecting
   */
  get(idx) {
    this.index = idx;
    return this.obj;
  }
  toArray() {
    return new Array(this.data.length).fill(0).map((_, i) => __spreadValues({}, this.get(i)));
  }
}

export { DataFrameView };
//# sourceMappingURL=DataFrameView.js.map
