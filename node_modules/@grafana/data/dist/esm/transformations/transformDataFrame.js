import { of } from 'rxjs';
import { mergeMap, map } from 'rxjs/operators';
import { getFrameMatchers } from './matchers.js';
import { standardTransformersRegistry } from './standardTransformersRegistry.js';

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
const getOperator = (config, ctx) => (source) => {
  var _a, _b;
  const info = standardTransformersRegistry.get(config.id);
  if (!info) {
    return source;
  }
  const defaultOptions = (_a = info.transformation.defaultOptions) != null ? _a : {};
  const options = __spreadValues(__spreadValues({}, defaultOptions), config.options);
  const matcher = ((_b = config.filter) == null ? void 0 : _b.options) ? getFrameMatchers(config.filter) : void 0;
  return source.pipe(
    mergeMap(
      (before) => of(filterInput(before, matcher)).pipe(
        info.transformation.operator(options, ctx),
        postProcessTransform(before, info, matcher)
      )
    )
  );
};
function filterInput(data, matcher) {
  if (matcher) {
    return data.filter((v) => matcher(v));
  }
  return data;
}
const postProcessTransform = (before, info, matcher) => (source) => source.pipe(
  map((after) => {
    if (after === before) {
      return after;
    }
    if (matcher) {
      let insert = 0;
      const append = before.filter((v, idx) => {
        const keep = !matcher(v);
        if (keep && !insert) {
          insert = idx;
        }
        return keep;
      });
      if (append.length) {
        after.splice(insert, 0, ...append);
      }
    }
    return after;
  })
);
function transformDataFrame(options, data, ctx) {
  const stream = of(data);
  if (!options.length) {
    return stream;
  }
  const operators = [];
  const context = ctx != null ? ctx : { interpolate: (str) => str };
  for (let index = 0; index < options.length; index++) {
    const config = options[index];
    if (isCustomTransformation(config)) {
      operators.push(config(context));
    } else {
      if (config.disabled) {
        continue;
      }
      operators.push(getOperator(config, context));
    }
  }
  return stream.pipe.apply(stream, operators);
}
function isCustomTransformation(t) {
  return typeof t === "function";
}

export { transformDataFrame };
//# sourceMappingURL=transformDataFrame.js.map
