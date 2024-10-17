import { map } from 'rxjs/operators';
import { fieldMatchers } from '../matchers.js';
import { FieldMatcherID } from '../matchers/ids.js';
import { DataTransformerID } from './ids.js';
import { joinDataFrames } from './joinDataFrames.js';

var JoinMode = /* @__PURE__ */ ((JoinMode2) => {
  JoinMode2["outer"] = "outer";
  JoinMode2["inner"] = "inner";
  JoinMode2["outerTabular"] = "outerTabular";
  return JoinMode2;
})(JoinMode || {});
const joinByFieldTransformer = {
  id: DataTransformerID.joinByField,
  aliasIds: [DataTransformerID.seriesToColumns],
  name: "Join by field",
  description: "Combine rows from two or more tables, based on a related field between them.  This can be used to outer join multiple time series on the _time_ field to show many time series in one table.",
  defaultOptions: {
    byField: void 0,
    // DEFAULT_KEY_FIELD,
    mode: "outer" /* outer */
  },
  operator: (options, ctx) => (source) => source.pipe(map((data) => joinByFieldTransformer.transformer(options, ctx)(data))),
  transformer: (options, ctx) => {
    let joinBy = void 0;
    return (data) => {
      if (data.length > 1) {
        if (options.byField && !joinBy) {
          joinBy = fieldMatchers.get(FieldMatcherID.byName).get(ctx.interpolate(options.byField));
        }
        const joined = joinDataFrames({ frames: data, joinBy, mode: options.mode });
        if (joined) {
          return [joined];
        }
      }
      return data;
    };
  }
};

export { JoinMode, joinByFieldTransformer };
//# sourceMappingURL=joinByField.js.map
