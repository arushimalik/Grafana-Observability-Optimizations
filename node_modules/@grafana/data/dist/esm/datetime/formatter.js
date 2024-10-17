import moment from 'moment-timezone';
import { getTimeZone } from './common.js';
import { systemDateFormats } from './formats.js';
import { dateTimeAsMoment, toUtc } from './moment_wrapper.js';

const dateTimeFormat = (dateInUtc, options) => toTz(dateInUtc, getTimeZone(options)).format(getFormat(options));
const dateTimeFormatISO = (dateInUtc, options) => toTz(dateInUtc, getTimeZone(options)).format();
const dateTimeFormatTimeAgo = (dateInUtc, options) => toTz(dateInUtc, getTimeZone(options)).fromNow();
const dateTimeFormatWithAbbrevation = (dateInUtc, options) => toTz(dateInUtc, getTimeZone(options)).format(`${systemDateFormats.fullDate} z`);
const timeZoneAbbrevation = (dateInUtc, options) => toTz(dateInUtc, getTimeZone(options)).format("z");
const getFormat = (options) => {
  var _a, _b;
  if (options == null ? void 0 : options.defaultWithMS) {
    return (_a = options == null ? void 0 : options.format) != null ? _a : systemDateFormats.fullDateMS;
  }
  return (_b = options == null ? void 0 : options.format) != null ? _b : systemDateFormats.fullDate;
};
const toTz = (dateInUtc, timeZone) => {
  const date = dateInUtc;
  const zone = moment.tz.zone(timeZone);
  if (zone && zone.name) {
    return dateTimeAsMoment(toUtc(date)).tz(zone.name);
  }
  switch (timeZone) {
    case "utc":
      return dateTimeAsMoment(toUtc(date));
    default:
      return dateTimeAsMoment(toUtc(date)).local();
  }
};

export { dateTimeFormat, dateTimeFormatISO, dateTimeFormatTimeAgo, dateTimeFormatWithAbbrevation, timeZoneAbbrevation };
//# sourceMappingURL=formatter.js.map
