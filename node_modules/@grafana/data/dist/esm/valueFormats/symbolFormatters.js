import { scaledUnits } from './valueFormats.js';

function currency(symbol, asSuffix) {
  const units = ["", "K", "M", "B", "T"];
  const scaler = scaledUnits(1e3, units);
  return (value, decimals, scaledDecimals) => {
    var _a;
    if (value == null) {
      return { text: "" };
    }
    const isNegative = value < 0;
    if (isNegative) {
      value = Math.abs(value);
    }
    const scaled = scaler(value, decimals, scaledDecimals);
    if (asSuffix) {
      scaled.suffix = scaled.suffix !== void 0 ? `${scaled.suffix}${symbol}` : void 0;
    } else {
      scaled.prefix = symbol;
    }
    if (isNegative) {
      scaled.prefix = `-${((_a = scaled.prefix) == null ? void 0 : _a.length) ? scaled.prefix : ""}`;
    }
    return scaled;
  };
}
const SI_PREFIXES = ["f", "p", "n", "\xB5", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y"];
const SI_BASE_INDEX = SI_PREFIXES.indexOf("");
function getOffsetFromSIPrefix(c) {
  const charIndex = SI_PREFIXES.findIndex((prefix) => prefix.normalize("NFKD") === c.normalize("NFKD"));
  return charIndex < 0 ? 0 : charIndex - SI_BASE_INDEX;
}
const BIN_PREFIXES = ["", "Ki", "Mi", "Gi", "Ti", "Pi", "Ei", "Zi", "Yi"];
function binaryPrefix(unit, offset = 0) {
  const units = BIN_PREFIXES.map((p) => " " + p + unit);
  return scaledUnits(1024, units, offset);
}
function SIPrefix(unit, offset = 0) {
  const units = SI_PREFIXES.map((p) => " " + p + unit);
  return scaledUnits(1e3, units, SI_BASE_INDEX + offset);
}

export { SIPrefix, binaryPrefix, currency, getOffsetFromSIPrefix };
//# sourceMappingURL=symbolFormatters.js.map
