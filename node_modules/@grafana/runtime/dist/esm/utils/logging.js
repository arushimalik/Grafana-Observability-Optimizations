import { faro, LogLevel } from '@grafana/faro-web-sdk';
export { LogLevel } from '@grafana/faro-web-sdk';
import { config } from '../config.js';

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
function logInfo(message, contexts) {
  if (config.grafanaJavascriptAgent.enabled) {
    faro.api.pushLog([message], {
      level: LogLevel.INFO,
      context: contexts
    });
  }
}
function logWarning(message, contexts) {
  if (config.grafanaJavascriptAgent.enabled) {
    faro.api.pushLog([message], {
      level: LogLevel.WARN,
      context: contexts
    });
  }
}
function logDebug(message, contexts) {
  if (config.grafanaJavascriptAgent.enabled) {
    faro.api.pushLog([message], {
      level: LogLevel.DEBUG,
      context: contexts
    });
  }
}
function logError(err, contexts) {
  if (config.grafanaJavascriptAgent.enabled) {
    faro.api.pushError(err, {
      context: contexts
    });
  }
}
function logMeasurement(type, values, context) {
  if (config.grafanaJavascriptAgent.enabled) {
    faro.api.pushMeasurement({
      type,
      values,
      context
    });
  }
}
function createMonitoringLogger(source, defaultContext) {
  const createFullContext = (contexts) => __spreadValues(__spreadValues({
    source
  }, defaultContext), contexts);
  return {
    /**
     * Logs a debug message with optional additional context.
     * @param {string} message - The debug message to be logged.
     * @param {LogContext} [contexts] - Optional additional context to be included.
     */
    logDebug: (message, contexts) => logDebug(message, createFullContext(contexts)),
    /**
     * Logs an informational message with optional additional context.
     * @param {string} message - The informational message to be logged.
     * @param {LogContext} [contexts] - Optional additional context to be included.
     */
    logInfo: (message, contexts) => logInfo(message, createFullContext(contexts)),
    /**
     * Logs a warning message with optional additional context.
     * @param {string} message - The warning message to be logged.
     * @param {LogContext} [contexts] - Optional additional context to be included.
     */
    logWarning: (message, contexts) => logWarning(message, createFullContext(contexts)),
    /**
     * Logs an error with optional additional context.
     * @param {Error} error - The error object to be logged.
     * @param {LogContext} [contexts] - Optional additional context to be included.
     */
    logError: (error, contexts) => logError(error, createFullContext(contexts)),
    /**
     * Logs an measurement with optional additional context.
     * @param {MeasurementEvent} measurement - The measurement object to be recorded.
     * @param {LogContext} [contexts] - Optional additional context to be included.
     */
    logMeasurement: (type, measurement, contexts) => logMeasurement(type, measurement, createFullContext(contexts))
  };
}

export { createMonitoringLogger, logDebug, logError, logInfo, logMeasurement, logWarning };
//# sourceMappingURL=logging.js.map
