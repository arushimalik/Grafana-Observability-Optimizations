import { FieldType } from '../../types/dataFrame.js';
import { FieldMatcherID } from './ids.js';

const fieldTypeMatcher = {
  id: FieldMatcherID.byType,
  name: "Field Type",
  description: "match based on the field type",
  defaultOptions: FieldType.number,
  get: (type) => {
    return (field, frame, allFrames) => {
      return type === field.type;
    };
  },
  getOptionsDisplayText: (type) => {
    return `Field type: ${type}`;
  }
};
const fieldTypesMatcher = {
  id: FieldMatcherID.byTypes,
  name: "Field Type",
  description: "match based on the field types",
  defaultOptions: /* @__PURE__ */ new Set(),
  get: (types) => {
    return (field, frame, allFrames) => {
      return types.has(field.type);
    };
  },
  getOptionsDisplayText: (types) => {
    return `Field types: ${[...types].join(" | ")}`;
  }
};
const numericMatcher = {
  id: FieldMatcherID.numeric,
  name: "Numeric Fields",
  description: "Fields with type number",
  get: () => {
    return fieldTypeMatcher.get(FieldType.number);
  },
  getOptionsDisplayText: () => {
    return "Numeric Fields";
  }
};
const timeMatcher = {
  id: FieldMatcherID.time,
  name: "Time Fields",
  description: "Fields with type time",
  get: () => {
    return fieldTypeMatcher.get(FieldType.time);
  },
  getOptionsDisplayText: () => {
    return "Time Fields";
  }
};
function getFieldTypeMatchers() {
  return [fieldTypeMatcher, fieldTypesMatcher, numericMatcher, timeMatcher];
}

export { getFieldTypeMatchers };
//# sourceMappingURL=fieldTypeMatcher.js.map
