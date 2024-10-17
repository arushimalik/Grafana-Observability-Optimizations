import { ValueMatcherID } from '../ids.js';

const isNullValueMatcher = {
  id: ValueMatcherID.isNull,
  name: "Is null",
  description: "Match where value for given field is null.",
  get: () => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      return value == null;
    };
  },
  getOptionsDisplayText: () => {
    return `Matches all rows where field is null.`;
  },
  isApplicable: () => true,
  getDefaultOptions: () => ({})
};
const isNotNullValueMatcher = {
  id: ValueMatcherID.isNotNull,
  name: "Is not null",
  description: "Match where value for given field is not null.",
  get: () => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      return value != null;
    };
  },
  getOptionsDisplayText: () => {
    return `Matches all rows where field is not null.`;
  },
  isApplicable: () => true,
  getDefaultOptions: () => ({})
};
const getNullValueMatchers = () => [isNullValueMatcher, isNotNullValueMatcher];

export { getNullValueMatchers };
//# sourceMappingURL=nullMatchers.js.map
