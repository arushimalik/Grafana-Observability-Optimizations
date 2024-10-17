import { ComparisonOperation } from '@grafana/schema';
import { ReducerID, reduceField } from '../fieldReducer.js';
import { compareValues } from './compareValues.js';
import { FieldMatcherID } from './ids.js';

function isBooleanReducer(r) {
  return r === ReducerID.allIsNull || r === ReducerID.allIsZero;
}
const fieldValueMatcherInfo = {
  id: FieldMatcherID.byValue,
  name: "By value (reducer)",
  description: "Reduce a field to a single value and test for inclusion",
  // This is added to overrides by default
  defaultOptions: {
    reducer: ReducerID.allIsZero,
    op: ComparisonOperation.GTE,
    value: 0
  },
  get: (props) => {
    if (!props || !props.reducer) {
      return () => false;
    }
    let { reducer, op, value } = props;
    const isBoolean = isBooleanReducer(reducer);
    if (!op) {
      op = ComparisonOperation.EQ;
    }
    return (field, frame, allFrames) => {
      const left = reduceField({
        field,
        reducers: [reducer]
      })[reducer];
      if (isBoolean) {
        return Boolean(left);
      }
      return compareValues(left, op, value);
    };
  },
  getOptionsDisplayText: (props) => {
    return `By value (${props.reducer})`;
  }
};

export { fieldValueMatcherInfo };
//# sourceMappingURL=fieldValueMatcher.js.map
