import { dateTimeFormat, rangeUtil } from '@grafana/data';

const mapOptionToTimeRange = (option, timeZone) => {
  return rangeUtil.convertRawToRange({ from: option.from, to: option.to }, timeZone);
};
const mapRangeToTimeOption = (range, timeZone) => {
  const from = dateTimeFormat(range.from, { timeZone });
  const to = dateTimeFormat(range.to, { timeZone });
  return {
    from,
    to,
    display: `${from} to ${to}`
  };
};

export { mapOptionToTimeRange, mapRangeToTimeOption };
//# sourceMappingURL=mapper.js.map
