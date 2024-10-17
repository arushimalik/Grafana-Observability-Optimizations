import { FieldType } from '../types/dataFrame.js';
import { getTimeField } from './processDataFrame.js';

const MAX_TIME_COMPARISONS = 100;
function isTimeSeriesFrame(frame) {
  if (frame.fields.length < 2) {
    return false;
  }
  const numberField = frame.fields.find((field) => field.type === FieldType.number);
  let timeFieldFound = false;
  for (const field of frame.fields) {
    if (isTimeSeriesField(field)) {
      timeFieldFound = true;
      break;
    }
  }
  return timeFieldFound && numberField !== void 0;
}
function isTimeSeriesFrames(data) {
  return !data.find((frame) => !isTimeSeriesFrame(frame));
}
function isTimeSeriesField(field) {
  if (field.type !== FieldType.time) {
    return false;
  }
  let greatestTime = null;
  let testWindow = field.values.length > MAX_TIME_COMPARISONS ? MAX_TIME_COMPARISONS : field.values.length;
  for (let i = 0; i < testWindow; i++) {
    const time = field.values[i];
    if (greatestTime === null || time !== null && time > greatestTime) {
      greatestTime = time;
    } else {
      return false;
    }
  }
  return true;
}
function anySeriesWithTimeField(data) {
  for (let i = 0; i < data.length; i++) {
    const timeField = getTimeField(data[i]);
    if (timeField.timeField !== void 0 && timeField.timeIndex !== void 0) {
      return true;
    }
  }
  return false;
}
function hasTimeField(data) {
  return data.fields.some((field) => field.type === FieldType.time);
}
function getRowUniqueId(dataFrame, rowIndex) {
  var _a;
  if (((_a = dataFrame.meta) == null ? void 0 : _a.uniqueRowIdFields) === void 0) {
    return void 0;
  }
  return dataFrame.meta.uniqueRowIdFields.map((fieldIndex) => dataFrame.fields[fieldIndex].values[rowIndex]).join("-");
}
function addRow(dataFrame, row) {
  if (row instanceof Array) {
    for (let i = 0; i < row.length; i++) {
      dataFrame.fields[i].values.push(row[i]);
    }
  } else {
    for (const field of dataFrame.fields) {
      field.values.push(row[field.name]);
    }
  }
  try {
    dataFrame.length++;
  } catch (e) {
  }
}

export { addRow, anySeriesWithTimeField, getRowUniqueId, hasTimeField, isTimeSeriesField, isTimeSeriesFrame, isTimeSeriesFrames };
//# sourceMappingURL=utils.js.map
