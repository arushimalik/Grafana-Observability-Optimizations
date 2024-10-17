var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
const DEFAULT_SYSTEM_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
const DEFAULT_SYSTEM_DATE_MS_FORMAT = "YYYY-MM-DD HH:mm:ss.SSS";
class SystemDateFormatsState {
  constructor() {
    __publicField(this, "fullDate", DEFAULT_SYSTEM_DATE_FORMAT);
    __publicField(this, "fullDateMS", DEFAULT_SYSTEM_DATE_MS_FORMAT);
    __publicField(this, "interval", {
      millisecond: "HH:mm:ss.SSS",
      second: "HH:mm:ss",
      minute: "HH:mm",
      hour: "MM/DD HH:mm",
      day: "MM/DD",
      month: "YYYY-MM",
      year: "YYYY"
    });
  }
  update(settings) {
    this.fullDate = settings.fullDate;
    this.interval = settings.interval;
    if (settings.useBrowserLocale) {
      this.useBrowserLocale();
    }
  }
  useBrowserLocale() {
    this.fullDate = localTimeFormat({
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
    this.fullDateMS = this.fullDate.replace("ss", "ss.SSS");
    this.interval.millisecond = localTimeFormat(
      { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false },
      null,
      this.interval.second
    ).replace("ss", "ss.SSS");
    this.interval.second = localTimeFormat(
      { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false },
      null,
      this.interval.second
    );
    this.interval.minute = localTimeFormat(
      { hour: "2-digit", minute: "2-digit", hour12: false },
      null,
      this.interval.minute
    );
    this.interval.hour = localTimeFormat(
      { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false },
      null,
      this.interval.hour
    );
    this.interval.day = localTimeFormat({ month: "2-digit", day: "2-digit", hour12: false }, null, this.interval.day);
    this.interval.month = localTimeFormat(
      { year: "numeric", month: "2-digit", hour12: false },
      null,
      this.interval.month
    );
  }
  getTimeFieldUnit(useMsResolution) {
    return `time:${useMsResolution ? this.fullDateMS : this.fullDate}`;
  }
}
function localTimeFormat(options, locale, fallback) {
  if (missingIntlDateTimeFormatSupport()) {
    return fallback != null ? fallback : DEFAULT_SYSTEM_DATE_FORMAT;
  }
  if (!locale && navigator) {
    locale = [...navigator.languages];
  }
  const dateTimeFormat = new Intl.DateTimeFormat(locale || void 0, options);
  const parts = dateTimeFormat.formatToParts(/* @__PURE__ */ new Date());
  const hour12 = dateTimeFormat.resolvedOptions().hour12;
  const mapping = {
    year: "YYYY",
    month: "MM",
    day: "DD",
    hour: hour12 ? "hh" : "HH",
    minute: "mm",
    second: "ss",
    weekday: "ddd",
    era: "N",
    dayPeriod: "A",
    timeZoneName: "Z"
  };
  return parts.map((part) => mapping[part.type] || part.value).join("");
}
const systemDateFormats = new SystemDateFormatsState();
const missingIntlDateTimeFormatSupport = () => {
  return !("DateTimeFormat" in Intl) || !("formatToParts" in Intl.DateTimeFormat.prototype);
};

export { SystemDateFormatsState, localTimeFormat, systemDateFormats };
//# sourceMappingURL=formats.js.map
