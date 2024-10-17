import { FieldType } from '../../../types/dataFrame.js';
import { ValueMatcherID } from '../ids.js';

const isGreaterValueMatcher = {
  id: ValueMatcherID.greater,
  name: "Is greater",
  description: "Match when field value is greater than option.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      if (isNaN(value)) {
        return false;
      }
      return value > options.value;
    };
  },
  getOptionsDisplayText: (options) => {
    return `Matches all rows where field value is greater than: ${options.value}.`;
  },
  isApplicable: (field) => field.type === FieldType.number,
  getDefaultOptions: () => ({ value: 0 })
};
const isGreaterOrEqualValueMatcher = {
  id: ValueMatcherID.greaterOrEqual,
  name: "Is greater or equal",
  description: "Match when field value is greater than or equal to option.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      if (isNaN(value)) {
        return false;
      }
      return value >= options.value;
    };
  },
  getOptionsDisplayText: (options) => {
    return `Matches all rows where field value is greater than or equal to: ${options.value}.`;
  },
  isApplicable: (field) => field.type === FieldType.number,
  getDefaultOptions: () => ({ value: 0 })
};
const isLowerValueMatcher = {
  id: ValueMatcherID.lower,
  name: "Is lower",
  description: "Match when field value is lower than option.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      if (isNaN(value)) {
        return false;
      }
      return value < options.value;
    };
  },
  getOptionsDisplayText: (options) => {
    return `Matches all rows where field value is lower than: ${options.value}.`;
  },
  isApplicable: (field) => field.type === FieldType.number,
  getDefaultOptions: () => ({ value: 0 })
};
const isLowerOrEqualValueMatcher = {
  id: ValueMatcherID.lowerOrEqual,
  name: "Is lower or equal",
  description: "Match when field value is lower or equal than option.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      if (isNaN(value)) {
        return false;
      }
      return value <= options.value;
    };
  },
  getOptionsDisplayText: (options) => {
    return `Matches all rows where field value is lower or equal than: ${options.value}.`;
  },
  isApplicable: (field) => field.type === FieldType.number,
  getDefaultOptions: () => ({ value: 0 })
};
const getNumericValueMatchers = () => [
  isGreaterValueMatcher,
  isGreaterOrEqualValueMatcher,
  isLowerValueMatcher,
  isLowerOrEqualValueMatcher
];

export { getNumericValueMatchers };
//# sourceMappingURL=numericMatchers.js.map
