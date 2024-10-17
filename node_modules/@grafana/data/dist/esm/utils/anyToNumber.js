import { toNumber } from 'lodash';

function anyToNumber(value) {
  if (typeof value === "number") {
    return value;
  }
  if (value === "" || value === null || value === void 0 || Array.isArray(value)) {
    return NaN;
  }
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }
  return toNumber(value);
}

export { anyToNumber };
//# sourceMappingURL=anyToNumber.js.map
