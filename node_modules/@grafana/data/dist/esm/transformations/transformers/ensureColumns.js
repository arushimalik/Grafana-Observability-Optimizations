import { map } from 'rxjs/operators';
import { getTimeField } from '../../dataframe/processDataFrame.js';
import { DataTransformerID } from './ids.js';
import { joinByFieldTransformer } from './joinByField.js';

const ensureColumnsTransformer = {
  id: DataTransformerID.ensureColumns,
  name: "Ensure Columns Transformer",
  description: "Will check if current data frames is series or columns. If in series it will convert to columns.",
  operator: (options, ctx) => (source) => source.pipe(map((data) => ensureColumnsTransformer.transformer(options, ctx)(data))),
  transformer: (_options, ctx) => (frames) => {
    const timeFieldName = findConsistentTimeFieldName(frames);
    if (frames.length > 1 && timeFieldName) {
      return joinByFieldTransformer.transformer(
        {
          byField: timeFieldName
        },
        ctx
      )(frames);
    }
    return frames;
  }
};
function findConsistentTimeFieldName(data) {
  let name = void 0;
  for (const frame of data) {
    const { timeField } = getTimeField(frame);
    if (!timeField) {
      return void 0;
    }
    if (!name) {
      name = timeField.name;
    } else if (name !== timeField.name) {
      return void 0;
    }
  }
  return name;
}

export { ensureColumnsTransformer };
//# sourceMappingURL=ensureColumns.js.map
