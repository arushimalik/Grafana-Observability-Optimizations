import { useMemo } from 'react';
import { usePluginContext, isDataSourcePluginContext } from '@grafana/data';
import { reportInteraction } from '../utils.js';
import { createDataSourcePluginEventProperties, createPluginEventProperties } from './eventProperties.js';

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
const namePrefix = "grafana_plugin_";
function usePluginInteractionReporter() {
  const context = usePluginContext();
  return useMemo(() => {
    const info = isDataSourcePluginContext(context) ? createDataSourcePluginEventProperties(context.instanceSettings) : createPluginEventProperties(context.meta);
    return (interactionName, properties) => {
      if (!validInteractionName(interactionName)) {
        throw new Error(`Interactions reported in plugins should start with: "${namePrefix}".`);
      }
      return reportInteraction(interactionName, __spreadValues(__spreadValues({}, properties), info));
    };
  }, [context]);
}
function validInteractionName(interactionName) {
  return interactionName.startsWith(namePrefix) && interactionName.length > namePrefix.length;
}

export { usePluginInteractionReporter };
//# sourceMappingURL=usePluginInteractionReporter.js.map
