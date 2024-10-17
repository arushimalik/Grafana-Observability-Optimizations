import { dateTimeFormat, systemDateFormats, formattedValueToString, getFieldDisplayName } from '@grafana/data';

const findHoverIndexFromData = (xAxisDimension, xPos) => {
  let lower = 0;
  let upper = xAxisDimension.values.length - 1;
  let middle;
  while (true) {
    if (lower > upper) {
      return Math.max(upper, 0);
    }
    middle = Math.floor((lower + upper) / 2);
    const xPosition = xAxisDimension.values[middle];
    if (xPosition === xPos) {
      return middle;
    } else if (xPosition && xPosition < xPos) {
      lower = middle + 1;
    } else {
      upper = middle - 1;
    }
  }
};
const getMultiSeriesGraphHoverInfo = (yAxisDimensions, xAxisDimensions, xAxisPosition, timeZone) => {
  let i, field, hoverIndex, hoverDistance, pointTime;
  const results = [];
  let minDistance, minTime;
  for (i = 0; i < yAxisDimensions.length; i++) {
    field = yAxisDimensions[i];
    const time = xAxisDimensions[i];
    hoverIndex = findHoverIndexFromData(time, xAxisPosition);
    hoverDistance = xAxisPosition - time.values[hoverIndex];
    pointTime = time.values[hoverIndex];
    if (minDistance === void 0 || hoverDistance >= 0 && (hoverDistance < minDistance || minDistance < 0) || hoverDistance < 0 && hoverDistance > minDistance) {
      minDistance = hoverDistance;
      minTime = time.display ? formattedValueToString(time.display(pointTime)) : pointTime;
    }
    const disp = field.display(field.values[hoverIndex]);
    results.push({
      value: formattedValueToString(disp),
      datapointIndex: hoverIndex,
      seriesIndex: i,
      color: disp.color,
      label: getFieldDisplayName(field),
      time: time.display ? formattedValueToString(time.display(pointTime)) : pointTime
    });
  }
  return {
    results,
    time: minTime
  };
};
const graphTickFormatter = (epoch, axis) => {
  var _a, _b;
  return dateTimeFormat(epoch, {
    format: (_a = axis == null ? void 0 : axis.options) == null ? void 0 : _a.timeformat,
    timeZone: (_b = axis == null ? void 0 : axis.options) == null ? void 0 : _b.timezone
  });
};
const graphTimeFormat = (ticks, min, max) => {
  if (min && max && ticks) {
    const range = max - min;
    const secPerTick = range / ticks / 1e3;
    const oneDay = 86400010;
    const oneYear = 31536e6;
    if (secPerTick <= 10) {
      return systemDateFormats.interval.millisecond;
    }
    if (secPerTick <= 45) {
      return systemDateFormats.interval.second;
    }
    if (range <= oneDay) {
      return systemDateFormats.interval.minute;
    }
    if (secPerTick <= 8e4) {
      return systemDateFormats.interval.hour;
    }
    if (range <= oneYear) {
      return systemDateFormats.interval.day;
    }
    if (secPerTick <= 31536e3) {
      return systemDateFormats.interval.month;
    }
    return systemDateFormats.interval.year;
  }
  return systemDateFormats.interval.minute;
};

export { findHoverIndexFromData, getMultiSeriesGraphHoverInfo, graphTickFormatter, graphTimeFormat };
//# sourceMappingURL=utils.js.map
