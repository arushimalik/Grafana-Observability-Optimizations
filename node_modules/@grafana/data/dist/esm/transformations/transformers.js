import { calculateFieldTransformer } from './transformers/calculateField.js';
import { concatenateTransformer } from './transformers/concat.js';
import { convertFieldTypeTransformer } from './transformers/convertFieldType.js';
import { ensureColumnsTransformer } from './transformers/ensureColumns.js';
import { filterFieldsTransformer, filterFramesTransformer } from './transformers/filter.js';
import { filterFieldsByNameTransformer } from './transformers/filterByName.js';
import { filterFramesByRefIdTransformer } from './transformers/filterByRefId.js';
import { filterByValueTransformer } from './transformers/filterByValue.js';
import { formatStringTransformer } from './transformers/formatString.js';
import { formatTimeTransformer } from './transformers/formatTime.js';
import { groupByTransformer } from './transformers/groupBy.js';
import { groupToNestedTable } from './transformers/groupToNestedTable.js';
import { groupingToMatrixTransformer } from './transformers/groupingToMatrix.js';
import { histogramTransformer } from './transformers/histogram.js';
import { joinByFieldTransformer } from './transformers/joinByField.js';
import { labelsToFieldsTransformer } from './transformers/labelsToFields.js';
import { limitTransformer } from './transformers/limit.js';
import { mergeTransformer } from './transformers/merge.js';
import { noopTransformer } from './transformers/noop.js';
import { orderFieldsTransformer } from './transformers/order.js';
import { organizeFieldsTransformer } from './transformers/organize.js';
import { reduceTransformer } from './transformers/reduce.js';
import { renameFieldsTransformer } from './transformers/rename.js';
import { renameByRegexTransformer } from './transformers/renameByRegex.js';
import { seriesToRowsTransformer } from './transformers/seriesToRows.js';
import { sortByTransformer } from './transformers/sortBy.js';

const standardTransformers = {
  noopTransformer,
  filterFieldsTransformer,
  filterFieldsByNameTransformer,
  filterFramesTransformer,
  filterFramesByRefIdTransformer,
  filterByValueTransformer,
  formatStringTransformer,
  formatTimeTransformer,
  orderFieldsTransformer,
  organizeFieldsTransformer,
  reduceTransformer,
  concatenateTransformer,
  calculateFieldTransformer,
  joinByFieldTransformer,
  /** @deprecated */
  seriesToColumnsTransformer: joinByFieldTransformer,
  seriesToRowsTransformer,
  renameFieldsTransformer,
  labelsToFieldsTransformer,
  ensureColumnsTransformer,
  groupByTransformer,
  sortByTransformer,
  mergeTransformer,
  renameByRegexTransformer,
  histogramTransformer,
  convertFieldTypeTransformer,
  groupingToMatrixTransformer,
  limitTransformer,
  groupToNestedTable
};

export { standardTransformers };
//# sourceMappingURL=transformers.js.map
