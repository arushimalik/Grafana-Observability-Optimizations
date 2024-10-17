import { isDateTime, dateMath, dateTimeParse } from '@grafana/data';

function isValid(value, roundUp, timeZone) {
  if (isDateTime(value)) {
    return value.isValid();
  }
  if (dateMath.isMathString(value)) {
    return dateMath.isValid(value);
  }
  const parsed = dateTimeParse(value, { roundUp, timeZone });
  return parsed.isValid();
}
function isValidTimeRange(range) {
  return dateMath.isValid(range.from) && dateMath.isValid(range.to);
}

export { isValid, isValidTimeRange };
//# sourceMappingURL=utils.js.map
