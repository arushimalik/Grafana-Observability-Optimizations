import { isDate, includes } from 'lodash';
import { isDateTime, dateTime, dateTimeForTimeZone, ISO_8601 } from './moment_wrapper.js';

const units = ["y", "M", "w", "d", "h", "m", "s", "Q"];
function isMathString(text) {
  if (!text) {
    return false;
  }
  if (typeof text === "string" && (text.substring(0, 3) === "now" || text.includes("||"))) {
    return true;
  } else {
    return false;
  }
}
function parse(text, roundUp, timezone, fiscalYearStartMonth) {
  if (!text) {
    return void 0;
  }
  if (typeof text !== "string") {
    if (isDateTime(text)) {
      return text;
    }
    if (isDate(text)) {
      return dateTime(text);
    }
    return void 0;
  } else {
    let time;
    let mathString = "";
    let index;
    let parseString;
    if (text.substring(0, 3) === "now") {
      time = dateTimeForTimeZone(timezone);
      mathString = text.substring("now".length);
    } else {
      index = text.indexOf("||");
      if (index === -1) {
        parseString = text;
        mathString = "";
      } else {
        parseString = text.substring(0, index);
        mathString = text.substring(index + 2);
      }
      time = dateTime(parseString, ISO_8601);
    }
    if (!mathString.length) {
      return time;
    }
    return parseDateMath(mathString, time, roundUp, fiscalYearStartMonth);
  }
}
function isValid(text) {
  const date = parse(text);
  if (!date) {
    return false;
  }
  if (isDateTime(date)) {
    return date.isValid();
  }
  return false;
}
function parseDateMath(mathString, time, roundUp, fiscalYearStartMonth = 0) {
  const strippedMathString = mathString.replace(/\s/g, "");
  const result = dateTime(time);
  let i = 0;
  const len = strippedMathString.length;
  while (i < len) {
    const c = strippedMathString.charAt(i++);
    let type;
    let num;
    let unitString;
    let isFiscal = false;
    if (c === "/") {
      type = 0;
    } else if (c === "+") {
      type = 1;
    } else if (c === "-") {
      type = 2;
    } else {
      return void 0;
    }
    if (isNaN(parseInt(strippedMathString.charAt(i), 10))) {
      num = 1;
    } else if (strippedMathString.length === 2) {
      num = parseInt(strippedMathString.charAt(i), 10);
    } else {
      const numFrom = i;
      while (!isNaN(parseInt(strippedMathString.charAt(i), 10))) {
        i++;
        if (i > 10) {
          return void 0;
        }
      }
      num = parseInt(strippedMathString.substring(numFrom, i), 10);
    }
    if (type === 0) {
      if (num !== 1) {
        return void 0;
      }
    }
    unitString = strippedMathString.charAt(i++);
    if (unitString === "f") {
      unitString = strippedMathString.charAt(i++);
      isFiscal = true;
    }
    const unit = unitString;
    if (!includes(units, unit)) {
      return void 0;
    } else {
      if (type === 0) {
        if (isFiscal) {
          roundToFiscal(fiscalYearStartMonth, result, unit, roundUp);
        } else {
          if (roundUp) {
            result.endOf(unit);
          } else {
            result.startOf(unit);
          }
        }
      } else if (type === 1) {
        result.add(num, unit);
      } else if (type === 2) {
        result.subtract(num, unit);
      }
    }
  }
  return result;
}
function roundToFiscal(fyStartMonth, dateTime2, unit, roundUp) {
  switch (unit) {
    case "y":
      if (roundUp) {
        roundToFiscal(fyStartMonth, dateTime2, unit, false).add(11, "M").endOf("M");
      } else {
        dateTime2.subtract((dateTime2.month() - fyStartMonth + 12) % 12, "M").startOf("M");
      }
      return dateTime2;
    case "Q":
      if (roundUp) {
        roundToFiscal(fyStartMonth, dateTime2, unit, false).add(2, "M").endOf("M");
      } else {
        dateTime2.subtract((dateTime2.month() - fyStartMonth + 12) % 3, "M").startOf("M");
      }
      return dateTime2;
    default:
      return void 0;
  }
}

export { isMathString, isValid, parse, parseDateMath, roundToFiscal };
//# sourceMappingURL=datemath.js.map
