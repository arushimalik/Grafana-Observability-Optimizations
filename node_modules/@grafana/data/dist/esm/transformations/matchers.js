import { Registry } from '../utils/Registry.js';
import { getFieldTypeMatchers } from './matchers/fieldTypeMatcher.js';
import { fieldValueMatcherInfo } from './matchers/fieldValueMatcher.js';
import { getFieldNameMatchers, getFrameNameMatchers } from './matchers/nameMatcher.js';
import { getFieldPredicateMatchers, getFramePredicateMatchers } from './matchers/predicates.js';
import { getRefIdMatchers } from './matchers/refIdMatcher.js';
import { getSimpleFieldMatchers } from './matchers/simpleFieldMatcher.js';
import { getEqualValueMatchers } from './matchers/valueMatchers/equalMatchers.js';
import { getNullValueMatchers } from './matchers/valueMatchers/nullMatchers.js';
import { getNumericValueMatchers } from './matchers/valueMatchers/numericMatchers.js';
import { getRangeValueMatchers } from './matchers/valueMatchers/rangeMatchers.js';
import { getRegexValueMatcher } from './matchers/valueMatchers/regexMatchers.js';
import { getSubstringValueMatchers } from './matchers/valueMatchers/substringMatchers.js';

const fieldMatchers = new Registry(() => {
  return [
    ...getFieldPredicateMatchers(),
    // Predicates
    ...getFieldTypeMatchers(),
    // by type
    ...getFieldNameMatchers(),
    // by name
    ...getSimpleFieldMatchers(),
    // first
    fieldValueMatcherInfo
    // reduce field (all null/zero)
  ];
});
const frameMatchers = new Registry(() => {
  return [
    ...getFramePredicateMatchers(),
    // Predicates
    ...getFrameNameMatchers(),
    // by name
    ...getRefIdMatchers()
    // by query refId
  ];
});
const valueMatchers = new Registry(() => {
  return [
    ...getNullValueMatchers(),
    ...getNumericValueMatchers(),
    ...getEqualValueMatchers(),
    ...getSubstringValueMatchers(),
    ...getRangeValueMatchers(),
    ...getRegexValueMatcher()
  ];
});
function getFieldMatcher(config) {
  const info = fieldMatchers.get(config.id);
  if (!info) {
    throw new Error("Unknown field matcher: " + config.id);
  }
  return info.get(config.options);
}
function getFrameMatchers(config) {
  const info = frameMatchers.get(config.id);
  if (!info) {
    throw new Error("Unknown frame matcher: " + config.id);
  }
  return info.get(config.options);
}
function getValueMatcher(config) {
  const info = valueMatchers.get(config.id);
  if (!info) {
    throw new Error("Unknown value matcher: " + config.id);
  }
  return info.get(config.options);
}

export { fieldMatchers, frameMatchers, getFieldMatcher, getFrameMatchers, getValueMatcher, valueMatchers };
//# sourceMappingURL=matchers.js.map
