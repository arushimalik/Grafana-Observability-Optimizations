import { clamp } from 'lodash';
import { getCategories } from './categories.js';
import { toDateTimeValueFormatter } from './dateTimeFormatters.js';
import { getOffsetFromSIPrefix, SIPrefix, currency } from './symbolFormatters.js';

function formattedValueToString(val) {
  var _a, _b;
  return `${(_a = val.prefix) != null ? _a : ""}${val.text}${(_b = val.suffix) != null ? _b : ""}`;
}
let categories = [];
const index = {};
let hasBuiltIndex = false;
function toFixed(value, decimals) {
  if (value === null) {
    return "";
  }
  if (value === Number.NEGATIVE_INFINITY || value === Number.POSITIVE_INFINITY) {
    return value.toLocaleString();
  }
  if (decimals === null || decimals === void 0) {
    decimals = getDecimalsForValue(value);
  }
  if (value === 0) {
    return value.toFixed(decimals);
  }
  const factor = decimals ? Math.pow(10, Math.max(0, decimals)) : 1;
  const formatted = String(Math.round(value * factor) / factor);
  if (formatted.indexOf("e") !== -1 || value === 0) {
    return formatted;
  }
  const decimalPos = formatted.indexOf(".");
  const precision = decimalPos === -1 ? 0 : formatted.length - decimalPos - 1;
  if (precision < decimals) {
    return (precision ? formatted : formatted + ".") + String(factor).slice(1, decimals - precision + 1);
  }
  return formatted;
}
function getDecimalsForValue(value) {
  const absValue = Math.abs(value);
  const log10 = Math.floor(Math.log(absValue) / Math.LN10);
  let dec = -log10 + 1;
  const magn = Math.pow(10, -dec);
  const norm = absValue / magn;
  if (norm > 2.25) {
    ++dec;
  }
  if (value % 1 === 0) {
    dec = 0;
  }
  const decimals = Math.max(0, dec);
  return decimals;
}
function toFixedScaled(value, decimals, ext) {
  return {
    text: toFixed(value, decimals),
    suffix: appendPluralIf(ext, Math.abs(value) > 1)
  };
}
function appendPluralIf(ext, condition) {
  if (!condition) {
    return ext;
  }
  switch (ext) {
    case " min":
    case " hour":
    case " day":
    case " week":
    case " year":
      return `${ext}s`;
    default:
      return ext;
  }
}
function toFixedUnit(unit, asPrefix) {
  return (size, decimals) => {
    if (size === null) {
      return { text: "" };
    }
    const text = toFixed(size, decimals);
    if (unit) {
      if (asPrefix) {
        return { text, prefix: unit };
      }
      return { text, suffix: " " + unit };
    }
    return { text };
  };
}
function isBooleanUnit(unit) {
  return unit && unit.startsWith("bool");
}
function booleanValueFormatter(t, f) {
  return (value) => {
    return { text: value ? t : f };
  };
}
const logb = (b, x) => Math.log10(x) / Math.log10(b);
function scaledUnits(factor, extArray, offset = 0) {
  return (size, decimals) => {
    if (size === null || size === void 0) {
      return { text: "" };
    }
    if (size === Number.NEGATIVE_INFINITY || size === Number.POSITIVE_INFINITY || isNaN(size)) {
      return { text: size.toLocaleString() };
    }
    const siIndex = size === 0 ? 0 : Math.floor(logb(factor, Math.abs(size)));
    const suffix = extArray[clamp(offset + siIndex, 0, extArray.length - 1)];
    return {
      text: toFixed(size / factor ** clamp(siIndex, -offset, extArray.length - offset - 1), decimals),
      suffix
    };
  };
}
function locale(value, decimals) {
  if (value == null) {
    return { text: "" };
  }
  return {
    text: value.toLocaleString(void 0, { maximumFractionDigits: decimals != null ? decimals : void 0 })
  };
}
function simpleCountUnit(symbol) {
  const units = ["", "K", "M", "B", "T"];
  const scaler = scaledUnits(1e3, units);
  return (size, decimals, scaledDecimals) => {
    if (size === null) {
      return { text: "" };
    }
    const v = scaler(size, decimals, scaledDecimals);
    v.suffix += " " + symbol;
    return v;
  };
}
function stringFormater(value) {
  return { text: `${value}` };
}
function buildFormats() {
  categories = getCategories();
  for (const cat of categories) {
    for (const format of cat.formats) {
      index[format.id] = format.fn;
    }
  }
  [{ from: "farenheit", to: "fahrenheit" }].forEach((alias) => {
    const f = index[alias.to];
    if (f) {
      index[alias.from] = f;
    }
  });
  hasBuiltIndex = true;
}
function getValueFormat(id) {
  if (!id) {
    return toFixedUnit("");
  }
  if (!hasBuiltIndex) {
    buildFormats();
  }
  const fmt = index[id];
  if (!fmt && id) {
    let idx = id.indexOf(":");
    if (idx > 0) {
      const key = id.substring(0, idx);
      const sub = id.substring(idx + 1);
      if (key === "prefix") {
        return toFixedUnit(sub, true);
      }
      if (key === "suffix") {
        return toFixedUnit(sub, false);
      }
      if (key === "time") {
        return toDateTimeValueFormatter(sub);
      }
      if (key === "si") {
        const offset = getOffsetFromSIPrefix(sub.charAt(0));
        const unit = offset === 0 ? sub : sub.substring(1);
        return SIPrefix(unit, offset);
      }
      if (key === "count") {
        return simpleCountUnit(sub);
      }
      if (key === "currency") {
        return currency(sub);
      }
      if (key === "bool") {
        idx = sub.indexOf("/");
        if (idx >= 0) {
          const t = sub.substring(0, idx);
          const f = sub.substring(idx + 1);
          return booleanValueFormatter(t, f);
        }
        return booleanValueFormatter(sub, "-");
      }
    }
    return toFixedUnit(id);
  }
  return fmt;
}
function getValueFormatterIndex() {
  if (!hasBuiltIndex) {
    buildFormats();
  }
  return index;
}
function getValueFormats() {
  if (!hasBuiltIndex) {
    buildFormats();
  }
  return categories.map((cat) => {
    return {
      text: cat.name,
      submenu: cat.formats.map((format) => {
        return {
          text: format.name,
          value: format.id
        };
      })
    };
  });
}

export { booleanValueFormatter, formattedValueToString, getValueFormat, getValueFormats, getValueFormatterIndex, isBooleanUnit, locale, scaledUnits, simpleCountUnit, stringFormater, toFixed, toFixedScaled, toFixedUnit };
//# sourceMappingURL=valueFormats.js.map
