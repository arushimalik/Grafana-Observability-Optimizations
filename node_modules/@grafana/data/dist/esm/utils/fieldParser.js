import { guessFieldTypeFromValue } from '../dataframe/processDataFrame.js';
import { FieldType } from '../types/dataFrame.js';

function makeFieldParser(value, field) {
  if (!field.type) {
    if (field.name === "time" || field.name === "Time") {
      field.type = FieldType.time;
    } else {
      field.type = guessFieldTypeFromValue(value);
    }
  }
  if (field.type === FieldType.number) {
    return (value2) => {
      return parseFloat(value2);
    };
  }
  if (field.type === FieldType.boolean) {
    return (value2) => {
      return !(value2[0] === "F" || value2[0] === "f" || value2[0] === "0");
    };
  }
  return (value2) => value2;
}

export { makeFieldParser };
//# sourceMappingURL=fieldParser.js.map
