import { isAfter, intervalToDuration, add } from 'date-fns';

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
const durationMap = {
  years: ["y", "Y", "years"],
  months: ["M", "months"],
  weeks: ["w", "W", "weeks"],
  days: ["d", "D", "days"],
  hours: ["h", "H", "hours"],
  minutes: ["m", "minutes"],
  seconds: ["s", "S", "seconds"]
};
function intervalToAbbreviatedDurationString(interval, includeSeconds = true) {
  if (isAfter(interval.start, interval.end)) {
    return "";
  }
  const duration = intervalToDuration(interval);
  return Object.entries(duration).reduce((str, [unit, value]) => {
    if (value && value !== 0 && !(unit === "seconds" && !includeSeconds && str)) {
      const padding = str !== "" ? " " : "";
      return str + `${padding}${value}${durationMap[unit][0]}`;
    }
    return str;
  }, "");
}
function parseDuration(durationString) {
  return durationString.split(" ").reduce((acc, value) => {
    const match = value.match(/(\d+)(.+)/);
    const rawLength = match == null ? void 0 : match[1];
    const unit = match == null ? void 0 : match[2];
    if (!(rawLength && unit)) {
      return acc;
    }
    const mapping = Object.entries(durationMap).find(([_, abbreviations]) => abbreviations == null ? void 0 : abbreviations.includes(match[2]));
    const length = parseInt(rawLength, 10);
    return mapping ? __spreadProps(__spreadValues({}, acc), { [mapping[0]]: length }) : acc;
  }, {});
}
function addDurationToDate(date, duration) {
  return add(date, duration);
}
function durationToMilliseconds(duration) {
  const now = /* @__PURE__ */ new Date();
  return addDurationToDate(now, duration).getTime() - now.getTime();
}
function isValidDate(dateString) {
  return !isNaN(Date.parse(dateString));
}
function isValidDuration(durationString) {
  var _a;
  for (const value of durationString.trim().split(" ")) {
    const match = value.match(/(\d+)(.+)/);
    if (match === null || match.length !== 3) {
      return false;
    }
    const key = (_a = Object.entries(durationMap).find(([_, abbreviations]) => abbreviations == null ? void 0 : abbreviations.includes(match[2]))) == null ? void 0 : _a[0];
    if (!key) {
      return false;
    }
  }
  return true;
}
function isValidGoDuration(durationString) {
  const timeUnits = ["h", "m", "s", "ms", "us", "\xB5s", "ns"];
  return validateDurationByUnits(durationString, timeUnits);
}
function isValidGrafanaDuration(durationString) {
  const timeUnits = ["y", "M", "w", "d", "h", "m", "s", "ms", "us", "\xB5s", "ns"];
  return validateDurationByUnits(durationString, timeUnits);
}
function validateDurationByUnits(durationString, timeUnits) {
  for (const value of durationString.trim().split(" ")) {
    const match = value.match(/([0-9]*[.]?[0-9]+)(.+)/);
    if (match === null || match.length !== 3) {
      return false;
    }
    const isValidUnit = timeUnits.includes(match[2]);
    if (!isValidUnit) {
      return false;
    }
  }
  return true;
}

export { addDurationToDate, durationToMilliseconds, intervalToAbbreviatedDurationString, isValidDate, isValidDuration, isValidGoDuration, isValidGrafanaDuration, parseDuration };
//# sourceMappingURL=durationutil.js.map
