import { map } from 'rxjs/operators';
import { getFieldMatcher, getFrameMatchers } from '../matchers.js';
import { DataTransformerID } from './ids.js';
import { noopTransformer } from './noop.js';

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
const filterFieldsTransformer = {
  id: DataTransformerID.filterFields,
  name: "Filter Fields",
  description: "select a subset of fields",
  defaultOptions: {},
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options, ctx) => (source) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
    if (!options.include && !options.exclude) {
      return source.pipe(noopTransformer.operator({}, ctx));
    }
    if (typeof ((_a = options.include) == null ? void 0 : _a.options) === "string") {
      options.include.options = ctx.interpolate((_b = options.include) == null ? void 0 : _b.options);
    } else if (typeof ((_d = (_c = options.include) == null ? void 0 : _c.options) == null ? void 0 : _d.pattern) === "string") {
      options.include.options.pattern = ctx.interpolate((_e = options.include) == null ? void 0 : _e.options.pattern);
    }
    if (typeof ((_f = options.exclude) == null ? void 0 : _f.options) === "string") {
      options.exclude.options = ctx.interpolate((_g = options.exclude) == null ? void 0 : _g.options);
    } else if (typeof ((_i = (_h = options.exclude) == null ? void 0 : _h.options) == null ? void 0 : _i.pattern) === "string") {
      options.exclude.options.pattern = ctx.interpolate((_j = options.exclude) == null ? void 0 : _j.options.pattern);
    }
    return source.pipe(
      map((data) => {
        const include = options.include ? getFieldMatcher(options.include) : null;
        const exclude = options.exclude ? getFieldMatcher(options.exclude) : null;
        const processed = [];
        for (const series of data) {
          const fields = [];
          for (let i = 0; i < series.fields.length; i++) {
            const field = series.fields[i];
            if (exclude) {
              if (exclude(field, series, data)) {
                continue;
              }
              if (!include) {
                fields.push(field);
              }
            }
            if (include && include(field, series, data)) {
              fields.push(field);
            }
          }
          if (!fields.length) {
            continue;
          }
          const copy = __spreadProps(__spreadValues({}, series), {
            // all the other properties
            fields
            // but a different set of fields
          });
          processed.push(copy);
        }
        return processed;
      })
    );
  }
};
const filterFramesTransformer = {
  id: DataTransformerID.filterFrames,
  name: "Filter Frames",
  description: "select a subset of frames",
  defaultOptions: {},
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options, ctx) => (source) => {
    if (!options.include && !options.exclude) {
      return source.pipe(noopTransformer.operator({}, ctx));
    }
    return source.pipe(
      map((data) => {
        const include = options.include ? getFrameMatchers(options.include) : null;
        const exclude = options.exclude ? getFrameMatchers(options.exclude) : null;
        const processed = [];
        for (const series of data) {
          if (exclude) {
            if (exclude(series)) {
              continue;
            }
            if (!include) {
              processed.push(series);
            }
          }
          if (include && include(series)) {
            processed.push(series);
          }
        }
        return processed;
      })
    );
  }
};

export { filterFieldsTransformer, filterFramesTransformer };
//# sourceMappingURL=filter.js.map
