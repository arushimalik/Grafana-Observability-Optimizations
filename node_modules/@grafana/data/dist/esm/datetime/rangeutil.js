import { each } from 'lodash';
import { parse, isMathString } from './datemath.js';
import { dateTimeFormat, dateTimeFormatTimeAgo, timeZoneAbbrevation } from './formatter.js';
import { isDateTime, dateTime } from './moment_wrapper.js';
import { dateTimeParse } from './parser.js';

const spans = {
  s: { display: "second" },
  m: { display: "minute" },
  h: { display: "hour" },
  d: { display: "day" },
  w: { display: "week" },
  M: { display: "month" },
  y: { display: "year" }
};
const rangeOptions = [
  { from: "now/d", to: "now/d", display: "Today" },
  { from: "now/d", to: "now", display: "Today so far" },
  { from: "now/w", to: "now/w", display: "This week" },
  { from: "now/w", to: "now", display: "This week so far" },
  { from: "now/M", to: "now/M", display: "This month" },
  { from: "now/M", to: "now", display: "This month so far" },
  { from: "now/y", to: "now/y", display: "This year" },
  { from: "now/y", to: "now", display: "This year so far" },
  { from: "now-1d/d", to: "now-1d/d", display: "Yesterday" },
  {
    from: "now-2d/d",
    to: "now-2d/d",
    display: "Day before yesterday"
  },
  {
    from: "now-7d/d",
    to: "now-7d/d",
    display: "This day last week"
  },
  { from: "now-1w/w", to: "now-1w/w", display: "Previous week" },
  { from: "now-1M/M", to: "now-1M/M", display: "Previous month" },
  { from: "now-1Q/fQ", to: "now-1Q/fQ", display: "Previous fiscal quarter" },
  { from: "now-1y/y", to: "now-1y/y", display: "Previous year" },
  { from: "now-1y/fy", to: "now-1y/fy", display: "Previous fiscal year" },
  { from: "now-5m", to: "now", display: "Last 5 minutes" },
  { from: "now-15m", to: "now", display: "Last 15 minutes" },
  { from: "now-30m", to: "now", display: "Last 30 minutes" },
  { from: "now-1h", to: "now", display: "Last 1 hour" },
  { from: "now-3h", to: "now", display: "Last 3 hours" },
  { from: "now-6h", to: "now", display: "Last 6 hours" },
  { from: "now-12h", to: "now", display: "Last 12 hours" },
  { from: "now-24h", to: "now", display: "Last 24 hours" },
  { from: "now-2d", to: "now", display: "Last 2 days" },
  { from: "now-7d", to: "now", display: "Last 7 days" },
  { from: "now-30d", to: "now", display: "Last 30 days" },
  { from: "now-90d", to: "now", display: "Last 90 days" },
  { from: "now-6M", to: "now", display: "Last 6 months" },
  { from: "now-1y", to: "now", display: "Last 1 year" },
  { from: "now-2y", to: "now", display: "Last 2 years" },
  { from: "now-5y", to: "now", display: "Last 5 years" },
  { from: "now/fQ", to: "now", display: "This fiscal quarter so far" },
  { from: "now/fQ", to: "now/fQ", display: "This fiscal quarter" },
  { from: "now/fy", to: "now", display: "This fiscal year so far" },
  { from: "now/fy", to: "now/fy", display: "This fiscal year" }
];
const hiddenRangeOptions = [
  { from: "now", to: "now+1m", display: "Next minute" },
  { from: "now", to: "now+5m", display: "Next 5 minutes" },
  { from: "now", to: "now+15m", display: "Next 15 minutes" },
  { from: "now", to: "now+30m", display: "Next 30 minutes" },
  { from: "now", to: "now+1h", display: "Next hour" },
  { from: "now", to: "now+3h", display: "Next 3 hours" },
  { from: "now", to: "now+6h", display: "Next 6 hours" },
  { from: "now", to: "now+12h", display: "Next 12 hours" },
  { from: "now", to: "now+24h", display: "Next 24 hours" },
  { from: "now", to: "now+2d", display: "Next 2 days" },
  { from: "now", to: "now+7d", display: "Next 7 days" },
  { from: "now", to: "now+30d", display: "Next 30 days" },
  { from: "now", to: "now+90d", display: "Next 90 days" },
  { from: "now", to: "now+6M", display: "Next 6 months" },
  { from: "now", to: "now+1y", display: "Next year" },
  { from: "now", to: "now+2y", display: "Next 2 years" },
  { from: "now", to: "now+5y", display: "Next 5 years" }
];
const rangeIndex = {};
each(rangeOptions, (frame) => {
  rangeIndex[frame.from + " to " + frame.to] = frame;
});
each(hiddenRangeOptions, (frame) => {
  rangeIndex[frame.from + " to " + frame.to] = frame;
});
function describeTextRange(expr) {
  const isLast = expr.indexOf("+") !== 0;
  if (expr.indexOf("now") === -1) {
    expr = (isLast ? "now-" : "now") + expr;
  }
  let opt = rangeIndex[expr + " to now"];
  if (opt) {
    return opt;
  }
  if (isLast) {
    opt = { from: expr, to: "now", display: "" };
  } else {
    opt = { from: "now", to: expr, display: "" };
  }
  const parts = /^now([-+])(\d+)(\w)/.exec(expr);
  if (parts) {
    const unit = parts[3];
    const amount = parseInt(parts[2], 10);
    const span = spans[unit];
    if (span) {
      opt.display = isLast ? "Last " : "Next ";
      opt.display += amount + " " + span.display;
      opt.section = span.section;
      if (amount > 1) {
        opt.display += "s";
      }
    }
  } else {
    opt.display = opt.from + " to " + opt.to;
    opt.invalid = true;
  }
  return opt;
}
function describeTimeRange(range, timeZone) {
  const option = rangeIndex[range.from.toString() + " to " + range.to.toString()];
  if (option) {
    return option.display;
  }
  const options = { timeZone };
  if (isDateTime(range.from) && isDateTime(range.to)) {
    return dateTimeFormat(range.from, options) + " to " + dateTimeFormat(range.to, options);
  }
  if (isDateTime(range.from)) {
    const parsed = parse(range.to, true, "utc");
    return parsed ? dateTimeFormat(range.from, options) + " to " + dateTimeFormatTimeAgo(parsed, options) : "";
  }
  if (isDateTime(range.to)) {
    const parsed = parse(range.from, false, "utc");
    return parsed ? dateTimeFormatTimeAgo(parsed, options) + " to " + dateTimeFormat(range.to, options) : "";
  }
  if (range.to.toString() === "now") {
    const res = describeTextRange(range.from);
    return res.display;
  }
  return range.from.toString() + " to " + range.to.toString();
}
const isValidTimeSpan = (value) => {
  if (value.indexOf("$") === 0 || value.indexOf("+$") === 0) {
    return true;
  }
  const info = describeTextRange(value);
  return info.invalid !== true;
};
const describeTimeRangeAbbreviation = (range, timeZone) => {
  if (isDateTime(range.from)) {
    return timeZoneAbbrevation(range.from, { timeZone });
  }
  const parsed = parse(range.from, true);
  return parsed ? timeZoneAbbrevation(parsed, { timeZone }) : "";
};
const convertRawToRange = (raw, timeZone, fiscalYearStartMonth, format) => {
  const from = dateTimeParse(raw.from, { roundUp: false, timeZone, fiscalYearStartMonth, format });
  const to = dateTimeParse(raw.to, { roundUp: true, timeZone, fiscalYearStartMonth, format });
  if (isMathString(raw.from) || isMathString(raw.to)) {
    return { from, to, raw };
  }
  return { from, to, raw: { from, to } };
};
function isRelativeTime(v) {
  if (typeof v === "string") {
    return v.indexOf("now") >= 0;
  }
  return false;
}
function isFiscal(timeRange) {
  if (typeof timeRange.raw.from === "string" && timeRange.raw.from.indexOf("f") > 0) {
    return true;
  } else if (typeof timeRange.raw.to === "string" && timeRange.raw.to.indexOf("f") > 0) {
    return true;
  }
  return false;
}
function isRelativeTimeRange(raw) {
  return isRelativeTime(raw.from) || isRelativeTime(raw.to);
}
function secondsToHms(seconds) {
  const numYears = Math.floor(seconds / 31536e3);
  if (numYears) {
    return numYears + "y";
  }
  const numDays = Math.floor(seconds % 31536e3 / 86400);
  if (numDays) {
    return numDays + "d";
  }
  const numHours = Math.floor(seconds % 31536e3 % 86400 / 3600);
  if (numHours) {
    return numHours + "h";
  }
  const numMinutes = Math.floor(seconds % 31536e3 % 86400 % 3600 / 60);
  if (numMinutes) {
    return numMinutes + "m";
  }
  const numSeconds = Math.floor(seconds % 31536e3 % 86400 % 3600 % 60);
  if (numSeconds) {
    return numSeconds + "s";
  }
  const numMilliseconds = Math.floor(seconds * 1e3);
  if (numMilliseconds) {
    return numMilliseconds + "ms";
  }
  return "less than a millisecond";
}
function msRangeToTimeString(rangeMs) {
  const rangeSec = Number((rangeMs / 1e3).toFixed());
  const h = Math.floor(rangeSec / 60 / 60);
  const m = Math.floor(rangeSec / 60) - h * 60;
  const s = Number((rangeSec % 60).toFixed());
  let formattedH = h ? h + "h" : "";
  let formattedM = m ? m + "min" : "";
  let formattedS = s ? s + "sec" : "";
  formattedH && formattedM ? formattedH = formattedH + " " : formattedH = formattedH;
  (formattedM || formattedH) && formattedS ? formattedM = formattedM + " " : formattedM = formattedM;
  return formattedH + formattedM + formattedS || "less than 1sec";
}
function calculateInterval(range, resolution, lowLimitInterval) {
  let lowLimitMs = 1;
  if (lowLimitInterval) {
    lowLimitMs = intervalToMs(lowLimitInterval);
  }
  let intervalMs = roundInterval((range.to.valueOf() - range.from.valueOf()) / resolution);
  if (lowLimitMs > intervalMs) {
    intervalMs = lowLimitMs;
  }
  return {
    intervalMs,
    interval: secondsToHms(intervalMs / 1e3)
  };
}
const interval_regex = /(-?\d+(?:\.\d+)?)(ms|[Mwdhmsy])/;
const intervals_in_seconds = {
  y: 31536e3,
  M: 2592e3,
  w: 604800,
  d: 86400,
  h: 3600,
  m: 60,
  s: 1,
  ms: 1e-3
};
function describeInterval(str) {
  if (Number(str)) {
    return {
      sec: intervals_in_seconds.s,
      type: "s",
      count: parseInt(str, 10)
    };
  }
  const matches = str.match(interval_regex);
  if (!matches) {
    throw new Error(
      `Invalid interval string, has to be either unit-less or end with one of the following units: "${Object.keys(
        intervals_in_seconds
      ).join(", ")}"`
    );
  }
  const sec = intervals_in_seconds[matches[2]];
  if (sec === void 0) {
    throw new Error("describeInterval failed: invalid interval string");
  }
  return {
    sec,
    type: matches[2],
    count: parseInt(matches[1], 10)
  };
}
function intervalToSeconds(str) {
  const info = describeInterval(str);
  return info.sec * info.count;
}
function intervalToMs(str) {
  const info = describeInterval(str);
  return info.sec * 1e3 * info.count;
}
function roundInterval(interval) {
  switch (true) {
    case interval < 10:
      return 1;
    case interval < 15:
      return 10;
    case interval < 35:
      return 20;
    case interval < 75:
      return 50;
    case interval < 150:
      return 100;
    case interval < 350:
      return 200;
    case interval < 750:
      return 500;
    case interval < 1500:
      return 1e3;
    case interval < 3500:
      return 2e3;
    case interval < 7500:
      return 5e3;
    case interval < 12500:
      return 1e4;
    case interval < 17500:
      return 15e3;
    case interval < 25e3:
      return 2e4;
    case interval < 45e3:
      return 3e4;
    case interval < 9e4:
      return 6e4;
    case interval < 21e4:
      return 12e4;
    case interval < 45e4:
      return 3e5;
    case interval < 75e4:
      return 6e5;
    case interval < 105e4:
      return 9e5;
    case interval < 15e5:
      return 12e5;
    case interval < 27e5:
      return 18e5;
    case interval < 54e5:
      return 36e5;
    case interval < 9e6:
      return 72e5;
    case interval < 162e5:
      return 108e5;
    case interval < 324e5:
      return 216e5;
    case interval < 864e5:
      return 432e5;
    case interval < 6048e5:
      return 864e5;
    case interval < 18144e5:
      return 6048e5;
    case interval < 36288e5:
      return 2592e6;
    default:
      return 31536e6;
  }
}
function timeRangeToRelative(timeRange, now = dateTime()) {
  const from = now.unix() - timeRange.from.unix();
  const to = now.unix() - timeRange.to.unix();
  return {
    from,
    to
  };
}
function relativeToTimeRange(relativeTimeRange, now = dateTime()) {
  const from = dateTime(now).subtract(relativeTimeRange.from, "s");
  const to = relativeTimeRange.to === 0 ? dateTime(now) : dateTime(now).subtract(relativeTimeRange.to, "s");
  return {
    from,
    to,
    raw: { from, to }
  };
}

export { calculateInterval, convertRawToRange, describeInterval, describeTextRange, describeTimeRange, describeTimeRangeAbbreviation, intervalToMs, intervalToSeconds, isFiscal, isRelativeTime, isRelativeTimeRange, isValidTimeSpan, msRangeToTimeString, relativeToTimeRange, roundInterval, secondsToHms, timeRangeToRelative };
//# sourceMappingURL=rangeutil.js.map
