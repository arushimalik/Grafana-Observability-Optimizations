import { FrameMatcherID } from '../matchers/ids.js';
import { filterFramesTransformer } from './filter.js';
import { DataTransformerID } from './ids.js';

const filterFramesByRefIdTransformer = {
  id: DataTransformerID.filterByRefId,
  name: "Filter data by query refId",
  description: "select a subset of results",
  defaultOptions: {},
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options, ctx) => (source) => {
    const filterOptions = {};
    if (options.include) {
      filterOptions.include = {
        id: FrameMatcherID.byRefId,
        options: options.include
      };
    }
    if (options.exclude) {
      filterOptions.exclude = {
        id: FrameMatcherID.byRefId,
        options: options.exclude
      };
    }
    return source.pipe(filterFramesTransformer.operator(filterOptions, ctx));
  }
};

export { filterFramesByRefIdTransformer };
//# sourceMappingURL=filterByRefId.js.map
