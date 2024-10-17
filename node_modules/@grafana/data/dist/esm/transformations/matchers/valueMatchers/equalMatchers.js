import { ValueMatcherID } from '../ids.js';

const isEqualValueMatcher = {
  id: ValueMatcherID.equal,
  name: "Is equal",
  description: "Match where value for given field is equal to options value.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      return value == options.value;
    };
  },
  getOptionsDisplayText: () => {
    return `Matches all rows where field is null.`;
  },
  isApplicable: () => true,
  getDefaultOptions: () => ({ value: "" })
};
const isNotEqualValueMatcher = {
  id: ValueMatcherID.notEqual,
  name: "Is not equal",
  description: "Match where value for given field is not equal to options value.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      return value != options.value;
    };
  },
  getOptionsDisplayText: () => {
    return `Matches all rows where field is not null.`;
  },
  isApplicable: () => true,
  getDefaultOptions: () => ({ value: "" })
};
const getEqualValueMatchers = () => [isEqualValueMatcher, isNotEqualValueMatcher];

export { getEqualValueMatchers };
//# sourceMappingURL=equalMatchers.js.map
