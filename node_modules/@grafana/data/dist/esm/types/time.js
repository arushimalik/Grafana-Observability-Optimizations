import { defaultTimeZone } from '@grafana/schema';
import { dateTime } from '../datetime/moment_wrapper.js';

const DefaultTimeZone = defaultTimeZone;
const TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
function getDefaultTimeRange() {
  const now = dateTime();
  return {
    from: dateTime(now).subtract(6, "hour"),
    to: now,
    raw: { from: "now-6h", to: "now" }
  };
}
function getDefaultRelativeTimeRange() {
  return {
    from: 600,
    to: 0
  };
}
function makeTimeRange(from, to) {
  const fromDateTime = typeof from === "string" ? dateTime(from) : from;
  const toDateTime = typeof to === "string" ? dateTime(to) : to;
  return {
    from: fromDateTime,
    to: toDateTime,
    raw: {
      from: fromDateTime,
      to: toDateTime
    }
  };
}

export { DefaultTimeZone, TIME_FORMAT, getDefaultRelativeTimeRange, getDefaultTimeRange, makeTimeRange };
//# sourceMappingURL=time.js.map
