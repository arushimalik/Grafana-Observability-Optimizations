import { map } from 'rxjs/operators';
import { guessFieldTypeForField } from '../../dataframe/processDataFrame.js';
import { getFieldDisplayName } from '../../field/fieldState.js';
import { FieldType } from '../../types/dataFrame.js';
import { TransformationApplicabilityLevels } from '../../types/transformations.js';
import { reduceField, ReducerID } from '../fieldReducer.js';
import { groupValuesByKey, createGroupedFields } from './groupBy.js';
import { DataTransformerID } from './ids.js';
import { findMaxFields } from './utils.js';

const SHOW_NESTED_HEADERS_DEFAULT = true;
const MINIMUM_FIELDS_REQUIRED = 2;
const groupToNestedTable = {
  id: DataTransformerID.groupToNestedTable,
  name: "Group to nested tables",
  description: "Group data by a field value and create nested tables with the grouped data",
  defaultOptions: {
    showSubframeHeaders: SHOW_NESTED_HEADERS_DEFAULT,
    fields: {}
  },
  isApplicable: (data) => {
    const maxFields = findMaxFields(data);
    return maxFields >= MINIMUM_FIELDS_REQUIRED ? TransformationApplicabilityLevels.Applicable : TransformationApplicabilityLevels.NotApplicable;
  },
  isApplicableDescription: (data) => {
    const maxFields = findMaxFields(data);
    return `The Group to nested table transformation requires a series with at least ${MINIMUM_FIELDS_REQUIRED} fields to work. The maximum number of fields found on a series is ${maxFields}`;
  },
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options) => (source) => source.pipe(
    map((data) => {
      const hasValidConfig = Object.keys(options.fields).find(
        (name) => options.fields[name].operation === "groupby" /* groupBy */
      );
      if (!hasValidConfig) {
        return data;
      }
      const processed = [];
      for (const frame of data) {
        const groupByFields = frame.fields.filter((field) => shouldGroupOnField(field, options));
        if (groupByFields.length === 0) {
          continue;
        }
        const valuesByGroupKey = groupValuesByKey(frame, groupByFields);
        const fields = createGroupedFields(groupByFields, valuesByGroupKey);
        const subFrames = groupToSubframes(valuesByGroupKey, options);
        for (let i = 0; i < frame.fields.length; i++) {
          const field = frame.fields[i];
          if (!shouldCalculateField(field, options)) {
            continue;
          }
          const fieldName = getFieldDisplayName(field);
          const aggregations = options.fields[fieldName].aggregations;
          const valuesByAggregation = {};
          valuesByGroupKey.forEach((value) => {
            const fieldWithValuesForGroup = value[fieldName];
            const results = reduceField({
              field: fieldWithValuesForGroup,
              reducers: aggregations
            });
            for (const aggregation of aggregations) {
              if (!Array.isArray(valuesByAggregation[aggregation])) {
                valuesByAggregation[aggregation] = [];
              }
              valuesByAggregation[aggregation].push(results[aggregation]);
            }
          });
          for (const aggregation of aggregations) {
            const aggregationField = {
              name: `${fieldName} (${aggregation})`,
              values: valuesByAggregation[aggregation],
              type: FieldType.other,
              config: {}
            };
            aggregationField.type = detectFieldType(aggregation, field, aggregationField);
            fields.push(aggregationField);
          }
        }
        fields.push({
          config: {},
          name: "Nested frames",
          type: FieldType.nestedFrames,
          values: subFrames
        });
        processed.push({
          fields,
          length: valuesByGroupKey.size
        });
      }
      return processed;
    })
  )
};
function createSubframe(fields, frameLength, options) {
  const showHeaders = options.showSubframeHeaders === void 0 ? SHOW_NESTED_HEADERS_DEFAULT : options.showSubframeHeaders;
  return {
    meta: { custom: { noHeader: !showHeaders } },
    length: frameLength,
    fields
  };
}
const shouldGroupOnField = (field, options) => {
  var _a;
  const fieldName = getFieldDisplayName(field);
  return ((_a = options == null ? void 0 : options.fields[fieldName]) == null ? void 0 : _a.operation) === "groupby" /* groupBy */;
};
const shouldCalculateField = (field, options) => {
  var _a;
  const fieldName = getFieldDisplayName(field);
  return ((_a = options == null ? void 0 : options.fields[fieldName]) == null ? void 0 : _a.operation) === "aggregate" /* aggregate */ && Array.isArray(options == null ? void 0 : options.fields[fieldName].aggregations) && (options == null ? void 0 : options.fields[fieldName].aggregations.length) > 0;
};
const detectFieldType = (aggregation, sourceField, targetField) => {
  var _a;
  switch (aggregation) {
    case ReducerID.allIsNull:
      return FieldType.boolean;
    case ReducerID.last:
    case ReducerID.lastNotNull:
    case ReducerID.first:
    case ReducerID.firstNotNull:
      return sourceField.type;
    default:
      return (_a = guessFieldTypeForField(targetField)) != null ? _a : FieldType.string;
  }
};
function groupToSubframes(valuesByGroupKey, options) {
  const subFrames = [];
  for (const [, value] of valuesByGroupKey) {
    const nestedFields = [];
    for (const [fieldName, field] of Object.entries(value)) {
      const fieldOpts = options.fields[fieldName];
      if (fieldOpts === void 0) {
        nestedFields.push(field);
      } else if (fieldOpts.aggregations === void 0 || fieldOpts.operation === "aggregate" /* aggregate */ && fieldOpts.aggregations.length === 0 || fieldOpts.operation === null || fieldOpts.operation === void 0) {
        nestedFields.push(field);
      }
    }
    if (nestedFields.length > 0) {
      subFrames.push([createSubframe(nestedFields, nestedFields[0].values.length, options)]);
    } else {
      subFrames.push([createSubframe([], 0, options)]);
    }
  }
  return subFrames;
}

export { SHOW_NESTED_HEADERS_DEFAULT, groupToNestedTable };
//# sourceMappingURL=groupToNestedTable.js.map
