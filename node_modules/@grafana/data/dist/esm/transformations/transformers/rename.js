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
const renameFieldsTransformer = {
  id: DataTransformerID.rename,
  name: "Rename fields by name",
  description: "Rename fields based on configuration given by user",
  defaultOptions: {
    renameByName: {}
  },
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options) => (source) => source.pipe(
    map((data) => {
      const renamer = createRenamer(options.renameByName);
      if (!Array.isArray(data) || data.length === 0) {
        return data;
      }
      return data.map((frame) => __spreadProps(__spreadValues({}, frame), {
        fields: renamer(frame)
      }));
    })
  )
};
const createRenamer = (renameByName) => (frame) => {
  if (!renameByName || Object.keys(renameByName).length === 0) {
    return frame.fields;
  }
  return frame.fields.map((field) => {
    const displayName = getFieldDisplayName(field, frame);
    const renameTo = renameByName[displayName];
    if (typeof renameTo !== "string" || renameTo.length === 0) {
      return field;
    }
    return __spreadProps(__spreadValues({}, field), {
      config: __spreadProps(__spreadValues({}, field.config), {
        displayName: renameTo
      }),
      state: __spreadProps(__spreadValues({}, field.state), {
        displayName: renameTo
      })
    });
  });
};

export { renameFieldsTransformer };
//# sourceMappingURL=rename.js.map
