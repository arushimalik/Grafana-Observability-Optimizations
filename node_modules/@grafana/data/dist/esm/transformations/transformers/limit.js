import { map } from 'rxjs/operators';
import { DataTransformerID } from './ids.js';
import { transformationsVariableSupport } from './utils.js';

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
const DEFAULT_LIMIT_FIELD = 10;
const limitTransformer = {
  id: DataTransformerID.limit,
  name: "Limit",
  description: "Limit the number of items to the top N",
  defaultOptions: {
    limitField: DEFAULT_LIMIT_FIELD
  },
  operator: (options, ctx) => (source) => source.pipe(
    map((data) => {
      let limit = DEFAULT_LIMIT_FIELD;
      if (options.limitField !== void 0) {
        if (typeof options.limitField === "string") {
          if (transformationsVariableSupport()) {
            limit = parseInt(ctx.interpolate(options.limitField), 10);
          } else {
            limit = parseInt(options.limitField, 10);
          }
        } else {
          limit = options.limitField;
        }
      }
      return data.map((frame) => {
        if (frame.length > limit) {
          return __spreadProps(__spreadValues({}, frame), {
            fields: frame.fields.map((f) => {
              return __spreadProps(__spreadValues({}, f), {
                values: f.values.slice(0, limit)
              });
            }),
            length: limit
          });
        }
        return frame;
      });
    })
  )
};

export { limitTransformer };
//# sourceMappingURL=limit.js.map
