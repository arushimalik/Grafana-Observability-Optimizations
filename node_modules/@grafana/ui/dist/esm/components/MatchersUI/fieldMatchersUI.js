import { Registry } from '@grafana/data';
import { fieldNameByRegexMatcherItem } from './FieldNameByRegexMatcherEditor.js';
import { fieldNameMatcherItem } from './FieldNameMatcherEditor.js';
import { fieldNamesMatcherItem } from './FieldNamesMatcherEditor.js';
import { fieldTypeMatcherItem } from './FieldTypeMatcherEditor.js';
import { fieldValueMatcherItem } from './FieldValueMatcher.js';
import { fieldsByFrameRefIdItem } from './FieldsByFrameRefIdMatcher.js';

const fieldMatchersUI = new Registry(() => [
  fieldNameMatcherItem,
  fieldNameByRegexMatcherItem,
  fieldTypeMatcherItem,
  fieldsByFrameRefIdItem,
  fieldNamesMatcherItem,
  fieldValueMatcherItem
]);

export { fieldMatchersUI };
//# sourceMappingURL=fieldMatchersUI.js.map
