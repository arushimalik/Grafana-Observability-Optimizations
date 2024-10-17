import { clone } from 'lodash';
import { map } from 'rxjs/operators';
import { getFieldDisplayName } from '../../field/fieldState.js';
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
const orderFieldsTransformer = {
  id: DataTransformerID.order,
  name: "Order fields by name",
  description: "Order fields based on configuration given by user",
  defaultOptions: {
    indexByName: {}
  },
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options) => (source) => source.pipe(
    map((data) => {
      const orderer = createFieldsOrderer(options.indexByName);
      if (!Array.isArray(data) || data.length === 0) {
        return data;
      }
      return data.map((frame) => __spreadProps(__spreadValues({}, frame), {
        fields: orderer(frame.fields, data, frame)
      }));
    })
  )
};
const createOrderFieldsComparer = (indexByName) => (a, b) => {
  return indexOfField(a, indexByName) - indexOfField(b, indexByName);
};
const createFieldsOrderer = (indexByName) => (fields, data, frame) => {
  if (!Array.isArray(fields) || fields.length === 0) {
    return fields;
  }
  if (!indexByName || Object.keys(indexByName).length === 0) {
    return fields;
  }
  const comparer = createOrderFieldsComparer(indexByName);
  return clone(fields).sort(
    (a, b) => comparer(getFieldDisplayName(a, frame, data), getFieldDisplayName(b, frame, data))
  );
};
const indexOfField = (fieldName, indexByName) => {
  if (Number.isInteger(indexByName[fieldName])) {
    return indexByName[fieldName];
  }
  return Number.MAX_SAFE_INTEGER;
};

export { createOrderFieldsComparer, orderFieldsTransformer };
//# sourceMappingURL=order.js.map
