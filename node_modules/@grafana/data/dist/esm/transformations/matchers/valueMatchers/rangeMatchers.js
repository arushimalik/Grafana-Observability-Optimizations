import { FieldType } from '../../../types/dataFrame.js';
import { ValueMatcherID } from '../ids.js';

const isBetweenValueMatcher = {
  id: ValueMatcherID.between,
  name: "Is between",
  description: "Match when field value is between given option values.",
  get: (options) => {
    return (valueIndex, field) => {
      const value = field.values[valueIndex];
      if (isNaN(value)) {
        return false;
      }
      return value > options.from && value < options.to;
    };
  },
  getOptionsDisplayText: (options) => {
    return `Matches all rows where field value is between ${options.from} and ${options.to}.`;
  },
  isApplicable: (field) => field.type === FieldType.number,
  getDefaultOptions: () => ({ from: 0, to: 100 })
};
const getRangeValueMatchers = () => [isBetweenValueMatcher];

export { getRangeValueMatchers };
//# sourceMappingURL=rangeMatchers.js.map
