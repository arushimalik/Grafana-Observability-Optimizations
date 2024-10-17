import { clone, sampleSize } from 'lodash';
import memoize from 'micro-memoize';
import tinycolor from 'tinycolor2';
import { FieldType, getFieldDisplayName, isDataFrame, isTimeSeriesFrame, formattedValueToString, isDataFrameWithValue, fieldReducers, getDisplayProcessor, reduceField } from '@grafana/data';
import { TableCellDisplayMode, TableCellBackgroundDisplayMode, BarGaugeDisplayMode } from '@grafana/schema';
import '../../utils/dom.js';
import 'react';
import { getTextColorForAlphaBackground } from '../../utils/colors.js';
import 'slate';
import 'ansicolor';
import '../../utils/logger.js';
import { BarGaugeCell } from './BarGaugeCell.js';
import { DataLinksCell } from './DataLinksCell.js';
import { DefaultCell } from './DefaultCell.js';
import { getFooterValue } from './FooterRow.js';
import { GeoCell } from './GeoCell.js';
import { ImageCell } from './ImageCell.js';
import { JSONViewCell } from './JSONViewCell.js';
import { RowExpander } from './RowExpander.js';
import { SparklineCell } from './SparklineCell.js';

var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
const EXPANDER_WIDTH = 50;
function getTextAlign(field) {
  if (!field) {
    return "flex-start";
  }
  if (field.config.custom) {
    const custom = field.config.custom;
    switch (custom.align) {
      case "right":
        return "flex-end";
      case "left":
        return "flex-start";
      case "center":
        return "center";
    }
  }
  if (field.type === FieldType.number) {
    return "flex-end";
  }
  return "flex-start";
}
function getColumns(data, availableWidth, columnMinWidth, expander, footerValues, isCountRowsSet) {
  var _a, _b;
  const columns = [];
  let fieldCountWithoutWidth = 0;
  if (expander) {
    columns.push({
      // Make an expander cell
      Header: () => null,
      // No header
      id: "expander",
      // It needs an ID
      // @ts-expect-error
      // TODO fix type error here
      Cell: RowExpander,
      width: EXPANDER_WIDTH,
      minWidth: EXPANDER_WIDTH,
      filter: (_rows, _id, _filterValues) => {
        return [];
      },
      justifyContent: "left",
      field: data.fields[0],
      sortType: "basic"
    });
    availableWidth -= EXPANDER_WIDTH;
  }
  for (const [fieldIndex, field] of data.fields.entries()) {
    const fieldTableOptions = field.config.custom || {};
    if (fieldTableOptions.hidden || field.type === FieldType.nestedFrames) {
      continue;
    }
    if (fieldTableOptions.width) {
      availableWidth -= fieldTableOptions.width;
    } else {
      fieldCountWithoutWidth++;
    }
    const selectSortType = (type) => {
      switch (type) {
        case FieldType.number:
        case FieldType.frame:
          return "number";
        case FieldType.time:
          return "basic";
        default:
          return "alphanumeric-insensitive";
      }
    };
    const Cell = getCellComponent((_a = fieldTableOptions.cellOptions) == null ? void 0 : _a.type, field);
    columns.push({
      // @ts-expect-error
      // TODO fix type error here
      Cell,
      id: fieldIndex.toString(),
      field,
      Header: fieldTableOptions.hideHeader ? "" : getFieldDisplayName(field, data),
      accessor: (_row, i) => field.values[i],
      sortType: selectSortType(field.type),
      width: fieldTableOptions.width,
      minWidth: (_b = fieldTableOptions.minWidth) != null ? _b : columnMinWidth,
      filter: memoize(filterByValue(field)),
      justifyContent: getTextAlign(field),
      Footer: getFooterValue(fieldIndex, footerValues, isCountRowsSet)
    });
  }
  let sharedWidth = availableWidth / fieldCountWithoutWidth;
  for (let i = fieldCountWithoutWidth; i > 0; i--) {
    for (const column of columns) {
      if (!column.width && column.minWidth > sharedWidth) {
        column.width = column.minWidth;
        availableWidth -= column.width;
        fieldCountWithoutWidth -= 1;
        sharedWidth = availableWidth / fieldCountWithoutWidth;
      }
    }
  }
  for (const column of columns) {
    if (!column.width) {
      column.width = sharedWidth;
    }
    column.minWidth = 50;
  }
  return columns;
}
function getCellComponent(displayMode, field) {
  switch (displayMode) {
    case TableCellDisplayMode.Custom:
    case TableCellDisplayMode.ColorText:
    case TableCellDisplayMode.ColorBackground:
      return DefaultCell;
    case TableCellDisplayMode.Image:
      return ImageCell;
    case TableCellDisplayMode.Gauge:
      return BarGaugeCell;
    case TableCellDisplayMode.Sparkline:
      return SparklineCell;
    case TableCellDisplayMode.JSONView:
      return JSONViewCell;
    case TableCellDisplayMode.DataLinks:
      return DataLinksCell;
  }
  if (field.type === FieldType.geo) {
    return GeoCell;
  }
  if (field.type === FieldType.frame) {
    const firstValue = field.values[0];
    if (isDataFrame(firstValue) && isTimeSeriesFrame(firstValue)) {
      return SparklineCell;
    }
    return JSONViewCell;
  }
  if (field.type === FieldType.other) {
    return JSONViewCell;
  }
  return DefaultCell;
}
function filterByValue(field) {
  return function(rows, id, filterValues) {
    if (rows.length === 0) {
      return rows;
    }
    if (!filterValues) {
      return rows;
    }
    if (!field) {
      return rows;
    }
    return rows.filter((row) => {
      if (!row.values.hasOwnProperty(id)) {
        return false;
      }
      const value = rowToFieldValue(row, field);
      return filterValues.find((filter) => filter.value === value) !== void 0;
    });
  };
}
function calculateUniqueFieldValues(rows, field) {
  if (!field || rows.length === 0) {
    return {};
  }
  const set = {};
  for (let index = 0; index < rows.length; index++) {
    const value = rowToFieldValue(rows[index], field);
    set[value || "(Blanks)"] = value;
  }
  return set;
}
function rowToFieldValue(row, field) {
  if (!field || !row) {
    return "";
  }
  const fieldValue = field.values[row.index];
  const displayValue = field.display ? field.display(fieldValue) : fieldValue;
  const value = field.display ? formattedValueToString(displayValue) : displayValue;
  return value;
}
function valuesToOptions(unique) {
  return Object.keys(unique).reduce((all, key) => all.concat({ value: unique[key], label: key }), []).sort(sortOptions);
}
function sortOptions(a, b) {
  if (a.label === void 0 && b.label === void 0) {
    return 0;
  }
  if (a.label === void 0 && b.label !== void 0) {
    return -1;
  }
  if (a.label !== void 0 && b.label === void 0) {
    return 1;
  }
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}
function getFilteredOptions(options, filterValues) {
  if (!filterValues) {
    return [];
  }
  return options.filter((option) => filterValues.some((filtered) => filtered.value === option.value));
}
function sortCaseInsensitive(a, b, id) {
  return String(a.values[id]).localeCompare(String(b.values[id]), void 0, { sensitivity: "base" });
}
function sortNumber(rowA, rowB, id) {
  const a = toNumber(rowA.values[id]);
  const b = toNumber(rowB.values[id]);
  return a === b ? 0 : a > b ? 1 : -1;
}
function toNumber(value) {
  var _a;
  if (isDataFrameWithValue(value)) {
    return (_a = value.value) != null ? _a : Number.NEGATIVE_INFINITY;
  }
  if (value === null || value === void 0 || value === "" || isNaN(value)) {
    return Number.NEGATIVE_INFINITY;
  }
  if (typeof value === "number") {
    return value;
  }
  return Number(value);
}
function getFooterItems(filterFields, values, options, theme2) {
  addMissingColumnIndex(filterFields);
  return filterFields.map((data, i) => {
    var _a;
    if (((_a = data == null ? void 0 : data.field) == null ? void 0 : _a.type) !== FieldType.number) {
      if (i === 0 && options.reducer && options.reducer.length > 0) {
        const reducer = fieldReducers.get(options.reducer[0]);
        return reducer.name;
      }
      return void 0;
    }
    let newField = clone(data.field);
    newField.values = values[data.id];
    newField.state = void 0;
    data.field = newField;
    if (options.fields && options.fields.length > 0) {
      const f = options.fields.find((f2) => {
        var _a2;
        return f2 === ((_a2 = data == null ? void 0 : data.field) == null ? void 0 : _a2.name);
      });
      if (f) {
        return getFormattedValue(data.field, options.reducer, theme2);
      }
      return void 0;
    }
    return getFormattedValue(data.field, options.reducer || [], theme2);
  });
}
function getFormattedValue(field, reducer, theme) {
  var _a;
  const calc = reducer[0];
  if (calc === void 0) {
    return "";
  }
  const format = (_a = field.display) != null ? _a : getDisplayProcessor({ field, theme });
  const fieldCalcValue = reduceField({ field, reducers: reducer })[calc];
  const reducerInfo = fieldReducers.get(calc);
  if (reducerInfo.preservesUnits) {
    return formattedValueToString(format(fieldCalcValue));
  }
  return formattedValueToString({ text: fieldCalcValue });
}
function createFooterCalculationValues(rows) {
  const values = [];
  for (const key in rows) {
    for (const [valKey, val] of Object.entries(rows[key].values)) {
      if (values[valKey] === void 0) {
        values[valKey] = [];
      }
      values[valKey].push(val);
    }
  }
  return values;
}
const defaultCellOptions = { type: TableCellDisplayMode.Auto };
function getCellOptions(field) {
  var _a, _b, _c;
  if ((_a = field.config.custom) == null ? void 0 : _a.displayMode) {
    return migrateTableDisplayModeToCellOptions((_b = field.config.custom) == null ? void 0 : _b.displayMode);
  }
  if (!((_c = field.config.custom) == null ? void 0 : _c.cellOptions)) {
    return defaultCellOptions;
  }
  return field.config.custom.cellOptions;
}
function migrateTableDisplayModeToCellOptions(displayMode) {
  switch (displayMode) {
    case "basic":
    case "gradient-gauge":
    case "lcd-gauge":
      let gaugeMode = BarGaugeDisplayMode.Basic;
      if (displayMode === "gradient-gauge") {
        gaugeMode = BarGaugeDisplayMode.Gradient;
      } else if (displayMode === "lcd-gauge") {
        gaugeMode = BarGaugeDisplayMode.Lcd;
      }
      return {
        type: TableCellDisplayMode.Gauge,
        mode: gaugeMode
      };
    case "color-background":
    case "color-background-solid":
      let mode = TableCellBackgroundDisplayMode.Basic;
      if (displayMode === "color-background") {
        mode = TableCellBackgroundDisplayMode.Gradient;
      }
      return {
        type: TableCellDisplayMode.ColorBackground,
        mode
      };
    default:
      return {
        // @ts-ignore
        type: displayMode
      };
  }
}
function addMissingColumnIndex(columns) {
  var _a;
  const missingIndex = columns.findIndex((field, index) => (field == null ? void 0 : field.id) !== String(index));
  if (missingIndex === -1 || ((_a = columns[missingIndex]) == null ? void 0 : _a.id) === "expander") {
    return;
  }
  columns.splice(missingIndex, 0, { id: String(missingIndex) });
  addMissingColumnIndex(columns);
}
function getAlignmentFactor(field, displayValue, rowIndex) {
  var _a;
  let alignmentFactor = (_a = field.state) == null ? void 0 : _a.alignmentFactors;
  if (alignmentFactor) {
    if (alignmentFactor.text.length < displayValue.text.length) {
      alignmentFactor.text = displayValue.text;
    }
    return alignmentFactor;
  } else {
    alignmentFactor = __spreadValues({}, displayValue);
    const maxIndex = Math.min(field.values.length, rowIndex + 1e3);
    for (let i = rowIndex + 1; i < maxIndex; i++) {
      const nextDisplayValue = field.display(field.values[i]);
      if (nextDisplayValue.text.length > alignmentFactor.text.length) {
        alignmentFactor.text = displayValue.text;
      }
    }
    if (field.state) {
      field.state.alignmentFactors = alignmentFactor;
    } else {
      field.state = { alignmentFactors: alignmentFactor };
    }
    return alignmentFactor;
  }
}
function isPointTimeValAroundTableTimeVal(pointTime, rowTime, threshold) {
  return Math.abs(Math.floor(pointTime) - rowTime) < threshold;
}
function calculateAroundPointThreshold(timeField) {
  let max = -Number.MAX_VALUE;
  let min = Number.MAX_VALUE;
  if (timeField.values.length < 2) {
    return 0;
  }
  for (let i = 0; i < timeField.values.length; i++) {
    const value = timeField.values[i];
    if (value > max) {
      max = value;
    }
    if (value < min) {
      min = value;
    }
  }
  return (max - min) / timeField.values.length;
}
function getCellColors(tableStyles, cellOptions, displayValue) {
  var _a;
  const darkeningFactor = tableStyles.theme.isDark ? 1 : -0.7;
  let textColor = void 0;
  let bgColor = void 0;
  let bgHoverColor = void 0;
  if (cellOptions.type === TableCellDisplayMode.ColorText) {
    textColor = displayValue.color;
  } else if (cellOptions.type === TableCellDisplayMode.ColorBackground) {
    const mode = (_a = cellOptions.mode) != null ? _a : TableCellBackgroundDisplayMode.Gradient;
    if (mode === TableCellBackgroundDisplayMode.Basic) {
      textColor = getTextColorForAlphaBackground(displayValue.color, tableStyles.theme.isDark);
      bgColor = tinycolor(displayValue.color).toRgbString();
      bgHoverColor = tinycolor(displayValue.color).setAlpha(1).toRgbString();
    } else if (mode === TableCellBackgroundDisplayMode.Gradient) {
      const hoverColor = tinycolor(displayValue.color).setAlpha(1).toRgbString();
      const bgColor2 = tinycolor(displayValue.color).darken(10 * darkeningFactor).spin(5);
      textColor = getTextColorForAlphaBackground(displayValue.color, tableStyles.theme.isDark);
      bgColor = `linear-gradient(120deg, ${bgColor2.toRgbString()}, ${displayValue.color})`;
      bgHoverColor = `linear-gradient(120deg, ${bgColor2.setAlpha(1).toRgbString()}, ${hoverColor})`;
    }
  }
  return { textColor, bgColor, bgHoverColor };
}
function guessTextBoundingBox(text, headerGroup, osContext, lineHeight, defaultRowHeight) {
  var _a;
  const width = Number((_a = headerGroup == null ? void 0 : headerGroup.width) != null ? _a : 300);
  const LINE_SCALE_FACTOR = 1.17;
  const LOW_LINE_PAD = 42;
  if (osContext !== null && typeof text === "string") {
    const words = text.split(/\s/);
    const lines = [];
    let currentLine = "";
    let extraLines = 0;
    for (let i = 0; i < words.length; i++) {
      const currentWord = words[i];
      let lineWidth = osContext.measureText(currentLine + " " + currentWord).width;
      if (lineWidth < width) {
        currentLine += " " + currentWord;
      } else {
        lines.push({
          width: lineWidth,
          line: currentLine
        });
        currentLine = currentWord;
      }
    }
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].width > width) {
        let extra = Math.floor(lines[i].width / width) - 1;
        extraLines += extra;
      }
    }
    let lineNumber = lines.length + extraLines;
    let height = 38;
    if (lineNumber > 5) {
      height = lineNumber * lineHeight * LINE_SCALE_FACTOR;
    } else {
      height = lineNumber * lineHeight + LOW_LINE_PAD;
    }
    return { width, height };
  }
  return { width, height: defaultRowHeight };
}
function guessLongestField(fieldConfig, data) {
  var _a, _b, _c;
  let longestField = void 0;
  const SAMPLE_SIZE = 3;
  if (fieldConfig !== void 0 && fieldConfig.defaults.custom !== void 0 && fieldConfig.defaults.custom.cellOptions.wrapText) {
    const stringFields = data.fields.filter((field) => field.type === FieldType.string);
    if (stringFields.length >= 1 && stringFields[0].values.length > 0) {
      const numValues = stringFields[0].values.length;
      let longestLength = 0;
      if (numValues <= 30) {
        for (const field of stringFields) {
          const fieldLength = field.values[0].length;
          if (fieldLength > longestLength) {
            longestLength = fieldLength;
            longestField = field;
          }
        }
      } else {
        for (const field of stringFields) {
          const vals = sampleSize(field.values, SAMPLE_SIZE);
          const meanLength = (((_a = vals[0]) == null ? void 0 : _a.length) + ((_b = vals[1]) == null ? void 0 : _b.length) + ((_c = vals[2]) == null ? void 0 : _c.length)) / 3;
          if (meanLength > longestLength) {
            longestLength = meanLength;
            longestField = field;
          }
        }
      }
    }
  }
  return longestField;
}

export { EXPANDER_WIDTH, calculateAroundPointThreshold, calculateUniqueFieldValues, createFooterCalculationValues, filterByValue, getAlignmentFactor, getCellColors, getCellComponent, getCellOptions, getColumns, getFilteredOptions, getFooterItems, getTextAlign, guessLongestField, guessTextBoundingBox, isPointTimeValAroundTableTimeVal, migrateTableDisplayModeToCellOptions, rowToFieldValue, sortCaseInsensitive, sortNumber, sortOptions, valuesToOptions };
//# sourceMappingURL=utils.js.map
