import { FieldType } from '../../types/dataFrame.js';
import { FieldMatcherID } from './ids.js';

const firstFieldMatcher = {
  id: FieldMatcherID.first,
  name: "First Field",
  description: "The first field in the frame",
  get: (type) => {
    return (field, frame, allFrames) => {
      return field === frame.fields[0];
    };
  },
  getOptionsDisplayText: () => {
    return `First field`;
  }
};
const firstTimeFieldMatcher = {
  id: FieldMatcherID.firstTimeField,
  name: "First time field",
  description: "The first field of type time in a frame",
  get: (type) => {
    return (field, frame, allFrames) => {
      return field.type === FieldType.time && field === frame.fields.find((f) => f.type === FieldType.time);
    };
  },
  getOptionsDisplayText: () => {
    return `First time field`;
  }
};
function getSimpleFieldMatchers() {
  return [firstFieldMatcher, firstTimeFieldMatcher];
}

export { getSimpleFieldMatchers };
//# sourceMappingURL=simpleFieldMatcher.js.map
