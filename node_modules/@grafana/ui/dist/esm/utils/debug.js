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
function attachDebugger(key, thebugger, logger) {
  var _a;
  if (process.env.NODE_ENV === "production") {
    return;
  }
  let completeDebugger = thebugger || {};
  if (logger !== void 0) {
    completeDebugger = __spreadProps(__spreadValues({}, completeDebugger), { enable: () => logger.enable(), disable: () => logger.disable() });
  }
  let debugGlobal = (_a = typeof window !== "undefined" && window["_debug"]) != null ? _a : {};
  debugGlobal[key] = completeDebugger;
  if (typeof window !== "undefined") {
    window["_debug"] = debugGlobal;
  }
}

export { attachDebugger };
//# sourceMappingURL=debug.js.map
