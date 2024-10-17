import moment from 'moment';

const ISO_8601 = moment.ISO_8601;
const setLocale = (language) => {
  moment.locale(language);
};
const getLocale = () => {
  return moment.locale();
};
const getLocaleData = () => {
  return moment.localeData();
};
const isDateTimeInput = (value) => {
  return value === null || typeof value === "string" || typeof value === "number" || value instanceof Date || Array.isArray(value) && value.every((v) => typeof v === "string" || typeof v === "number") || isDateTime(value);
};
const isDateTime = (value) => {
  return moment.isMoment(value);
};
const toUtc = (input, formatInput) => {
  return moment.utc(input, formatInput);
};
const toDuration = (input, unit) => {
  return moment.duration(input, unit);
};
const dateTime = (input, formatInput) => {
  return moment(input, formatInput);
};
const dateTimeAsMoment = (input) => {
  return dateTime(input);
};
const dateTimeForTimeZone = (timezone, input, formatInput) => {
  if (timezone && timezone !== "browser") {
    let result;
    if (typeof input === "string" && formatInput) {
      result = moment.tz(input, formatInput, timezone);
    } else {
      result = moment.tz(input, timezone);
    }
    if (isDateTime(result)) {
      return result;
    }
  }
  return dateTime(input, formatInput);
};
const getWeekdayIndex = (day) => {
  return moment.weekdays().findIndex((wd) => wd.toLowerCase() === day.toLowerCase());
};
const getWeekdayIndexByEnglishName = (day) => ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].findIndex(
  (wd) => wd.toLowerCase() === day.toLowerCase()
);
const setWeekStart = (weekStart) => {
  const suffix = "-weekStart";
  const language = getLocale().replace(suffix, "");
  const dow = weekStart ? getWeekdayIndexByEnglishName(weekStart) : -1;
  if (dow !== -1) {
    moment.locale(language + suffix, {
      parentLocale: language,
      week: {
        dow
      }
    });
  } else {
    setLocale(language);
  }
};

export { ISO_8601, dateTime, dateTimeAsMoment, dateTimeForTimeZone, getLocale, getLocaleData, getWeekdayIndex, getWeekdayIndexByEnglishName, isDateTime, isDateTimeInput, setLocale, setWeekStart, toDuration, toUtc };
//# sourceMappingURL=moment_wrapper.js.map
