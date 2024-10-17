import { lowerCase } from 'lodash';
import moment from 'moment-timezone';
import { getTimeZone } from './common.js';
import { isValid, parse } from './datemath.js';
import { systemDateFormats } from './formats.js';
import { isDateTime, dateTime, dateTimeForTimeZone, toUtc } from './moment_wrapper.js';

const dateTimeParse = (value, options) => {
  if (isDateTime(value)) {
    return value;
  }
  if (typeof value === "string") {
    return parseString(value, options);
  }
  return parseOthers(value, options);
};
const parseString = (value, options) => {
  var _a;
  if (value.indexOf("now") !== -1) {
    if (!isValid(value)) {
      return dateTime();
    }
    const parsed = parse(value, options == null ? void 0 : options.roundUp, options == null ? void 0 : options.timeZone, options == null ? void 0 : options.fiscalYearStartMonth);
    return parsed || dateTime();
  }
  const timeZone = getTimeZone(options);
  const zone = moment.tz.zone(timeZone);
  const format = (_a = options == null ? void 0 : options.format) != null ? _a : systemDateFormats.fullDate;
  if (zone && zone.name) {
    return dateTimeForTimeZone(zone.name, value, format);
  }
  switch (lowerCase(timeZone)) {
    case "utc":
      return toUtc(value, format);
    default:
      return dateTime(value, format);
  }
};
const parseOthers = (value, options) => {
  const date = value;
  const timeZone = getTimeZone(options);
  const zone = moment.tz.zone(timeZone);
  if (zone && zone.name) {
    return dateTimeForTimeZone(zone.name, date);
  }
  switch (lowerCase(timeZone)) {
    case "utc":
      return toUtc(date);
    default:
      return dateTime(date);
  }
};

export { dateTimeParse };
//# sourceMappingURL=parser.js.map
