import { availableIconsIndex, FieldType } from '@grafana/data';
export { toIconName } from '@grafana/data';

const isIconSize = (value) => {
  return ["xs", "sm", "md", "lg", "xl", "xxl", "xxxl"].includes(value);
};
const getAvailableIcons = () => Object.keys(availableIconsIndex);
function getFieldTypeIcon(field) {
  return getFieldTypeIconName(field == null ? void 0 : field.type);
}
function getFieldTypeIconName(type) {
  if (type) {
    switch (type) {
      case FieldType.time:
        return "clock-nine";
      case FieldType.string:
        return "font";
      case FieldType.number:
        return "calculator-alt";
      case FieldType.boolean:
        return "toggle-on";
      case FieldType.trace:
        return "info-circle";
      case FieldType.enum:
        return "list-ol";
      case FieldType.geo:
        return "map-marker";
      case FieldType.other:
        return "brackets-curly";
    }
  }
  return "question-circle";
}

export { getAvailableIcons, getFieldTypeIcon, getFieldTypeIconName, isIconSize };
//# sourceMappingURL=icon.js.map
