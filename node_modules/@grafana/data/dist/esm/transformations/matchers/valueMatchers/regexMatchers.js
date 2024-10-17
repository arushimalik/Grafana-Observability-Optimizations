import { ValueMatcherID } from '../ids.js';

const regexValueMatcher = {
  id: ValueMatcherID.regex,
  name: "Regex",
  description: "Match when field value is matching regex.",
  get: (options) => {
    const regex = new RegExp(options.value);
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      return regex.test(value);
    };
  },
  getOptionsDisplayText: (options) => {
    return `Matches all rows where field value is matching regex: ${options.value}`;
  },
  isApplicable: () => true,
  getDefaultOptions: () => ({ value: ".*" })
};
const getRegexValueMatcher = () => [regexValueMatcher];

export { getRegexValueMatcher };
//# sourceMappingURL=regexMatchers.js.map
