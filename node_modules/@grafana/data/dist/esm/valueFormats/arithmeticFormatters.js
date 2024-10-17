import { toFixed } from './valueFormats.js';

function toPercent(size, decimals) {
  if (size === null) {
    return { text: "" };
  }
  return { text: toFixed(size, decimals), suffix: "%" };
}
function toPercentUnit(size, decimals) {
  if (size === null) {
    return { text: "" };
  }
  return { text: toFixed(100 * size, decimals), suffix: "%" };
}
function toHex0x(value, decimals) {
  if (value == null) {
    return { text: "" };
  }
  const asHex = toHex(value, decimals);
  if (asHex.text.substring(0, 1) === "-") {
    asHex.text = "-0x" + asHex.text.substring(1);
  } else {
    asHex.text = "0x" + asHex.text;
  }
  return asHex;
}
function toHex(value, decimals) {
  if (value == null) {
    return { text: "" };
  }
  return {
    text: parseFloat(toFixed(value, decimals)).toString(16).toUpperCase()
  };
}
function sci(value, decimals) {
  if (value == null) {
    return { text: "" };
  }
  return { text: value.toExponential(decimals != null ? decimals : void 0) };
}

export { sci, toHex, toHex0x, toPercent, toPercentUnit };
//# sourceMappingURL=arithmeticFormatters.js.map
