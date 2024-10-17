import { FieldMatcherID } from '../matchers/ids.js';
import { filterFieldsTransformer } from './filter.js';
import { DataTransformerID } from './ids.js';

const filterFieldsByNameTransformer = {
  id: DataTransformerID.filterFieldsByName,
  name: "Filter fields by name",
  description: "select a subset of fields",
  defaultOptions: {},
  /**
   * Return a modified copy of the series. If the transform is not or should not
   * be applied, just return the input series
   */
  operator: (options, ctx) => (source) => source.pipe(
    filterFieldsTransformer.operator(
      {
        include: getMatcherConfig(ctx, options.include, options.byVariable),
        exclude: getMatcherConfig(ctx, options.exclude, options.byVariable)
      },
      ctx
    )
  )
};
const getMatcherConfig = (ctx, options, byVariable) => {
  if (!options) {
    return void 0;
  }
  const { names, pattern, variable } = options;
  if (byVariable && variable) {
    const stringOfNames = ctx.interpolate(variable);
    if (/\{.*\}/.test(stringOfNames)) {
      const namesFromString = stringOfNames.slice(1).slice(0, -1).split(",");
      return { id: FieldMatcherID.byNames, options: { names: namesFromString } };
    }
    return { id: FieldMatcherID.byNames, options: { names: stringOfNames.split(",") } };
  }
  if ((!Array.isArray(names) || names.length === 0) && !pattern) {
    return void 0;
  }
  if (!pattern) {
    return { id: FieldMatcherID.byNames, options: { names } };
  }
  if (!Array.isArray(names) || names.length === 0) {
    return { id: FieldMatcherID.byRegexp, options: pattern };
  }
  return { id: FieldMatcherID.byRegexpOrNames, options };
};

export { filterFieldsByNameTransformer, getMatcherConfig };
//# sourceMappingURL=filterByName.js.map
