import { getZone } from '@grafana/data';

function adjustDateForReactCalendar(date, timeZone) {
  const zone = getZone(timeZone);
  if (!zone) {
    return date;
  }
  const timezonePrefOffset = zone.utcOffset(date.getTime());
  const localOffset = date.getTimezoneOffset();
  const diff = timezonePrefOffset - localOffset;
  const newDate = new Date(date.getTime() - diff * 1e3 * 60);
  return newDate;
}

export { adjustDateForReactCalendar };
//# sourceMappingURL=adjustDateForReactCalendar.js.map
