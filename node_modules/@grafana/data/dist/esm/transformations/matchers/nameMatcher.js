import { getFieldDisplayName } from '../../field/fieldState.js';
import { stringToJsRegex } from '../../text/string.js';
import { TIME_SERIES_VALUE_FIELD_NAME, FieldType } from '../../types/dataFrame.js';
import { FieldMatcherID, FrameMatcherID } from './ids.js';

var ByNamesMatcherMode = /* @__PURE__ */ ((ByNamesMatcherMode2) => {
  ByNamesMatcherMode2["exclude"] = "exclude";
  ByNamesMatcherMode2["include"] = "include";
  return ByNamesMatcherMode2;
})(ByNamesMatcherMode || {});
const fieldNameMatcher = {
  id: FieldMatcherID.byName,
  name: "Field Name",
  description: "match the field name",
  defaultOptions: "",
  get: (name) => {
    const uniqueNames = /* @__PURE__ */ new Set([name]);
    const fallback = fieldNameFallback(uniqueNames);
    return (field, frame, allFrames) => {
      return name === field.name || name === getFieldDisplayName(field, frame, allFrames) || Boolean(fallback && fallback(field, frame, allFrames));
    };
  },
  getOptionsDisplayText: (name) => {
    return `Field name: ${name}`;
  }
};
const multipleFieldNamesMatcher = {
  id: FieldMatcherID.byNames,
  name: "Field Names",
  description: "match any of the given the field names",
  defaultOptions: {
    mode: "include" /* include */,
    names: []
  },
  get: (options) => {
    const { names, mode = "include" /* include */ } = options;
    const uniqueNames = new Set(names != null ? names : []);
    const fallback = fieldNameFallback(uniqueNames);
    const matcher = (field, frame, frames) => {
      return uniqueNames.has(field.name) || uniqueNames.has(getFieldDisplayName(field, frame, frames)) || Boolean(fallback && fallback(field, frame, frames));
    };
    if (mode === "exclude" /* exclude */) {
      return (field, frame, frames) => {
        return !matcher(field, frame, frames);
      };
    }
    return matcher;
  },
  getOptionsDisplayText: (options) => {
    const { names, mode } = options;
    const displayText = (names != null ? names : []).join(", ");
    if (mode === "exclude" /* exclude */) {
      return `All except: ${displayText}`;
    }
    return `All of: ${displayText}`;
  }
};
function fieldNameFallback(fields) {
  var _a, _b, _c;
  let fallback = void 0;
  const useMatcherFallback = (_c = (_b = (_a = window == null ? void 0 : window.grafanaBootData) == null ? void 0 : _a.settings) == null ? void 0 : _b.featureToggles) == null ? void 0 : _c.dataplaneFrontendFallback;
  if (useMatcherFallback) {
    if (fields.has(TIME_SERIES_VALUE_FIELD_NAME)) {
      fallback = (field, frame) => {
        var _a2;
        return Boolean(field.labels) && // Value was reasonable when the name was set in labels or on the frame
        ((_a2 = field.labels) == null ? void 0 : _a2.__name__) === field.name;
      };
    } else if (fields.has("Time") || fields.has("time")) {
      fallback = (field, frame) => {
        var _a2;
        return ((_a2 = frame.meta) == null ? void 0 : _a2.typeVersion) == null && field.type === FieldType.time;
      };
    }
  }
  return fallback;
}
const regexpFieldNameMatcher = {
  id: FieldMatcherID.byRegexp,
  name: "Field Name by Regexp",
  description: "match the field name by a given regexp pattern",
  defaultOptions: "/.*/",
  get: (pattern) => {
    const regexp = patternToRegex(pattern);
    return (field, frame, allFrames) => {
      const displayName = getFieldDisplayName(field, frame, allFrames);
      return !!regexp && regexp.test(displayName);
    };
  },
  getOptionsDisplayText: (pattern) => {
    return `Field name by pattern: ${pattern}`;
  }
};
const fieldsInFrameMatcher = {
  id: FieldMatcherID.byFrameRefID,
  name: "Fields by frame refId",
  description: "match all fields returned in data frame with refId.",
  defaultOptions: "",
  get: (refId) => {
    return (field, frame, allFrames) => {
      return frame.refId === refId;
    };
  },
  getOptionsDisplayText: (refId) => {
    return `Math all fields returned by query with reference ID: ${refId}`;
  }
};
const regexpOrMultipleNamesMatcher = {
  id: FieldMatcherID.byRegexpOrNames,
  name: "Field Name by Regexp or Names",
  description: "match the field name by a given regexp pattern or given names",
  defaultOptions: {
    pattern: "/.*/",
    names: []
  },
  get: (options) => {
    var _a;
    const regexpMatcher = regexpFieldNameMatcher.get((options == null ? void 0 : options.pattern) || "");
    const namesMatcher = multipleFieldNamesMatcher.get({
      mode: "include" /* include */,
      names: (_a = options == null ? void 0 : options.names) != null ? _a : []
    });
    return (field, frame, allFrames) => {
      return namesMatcher(field, frame, allFrames) || regexpMatcher(field, frame, allFrames);
    };
  },
  getOptionsDisplayText: (options) => {
    var _a, _b, _c;
    const pattern = (_a = options == null ? void 0 : options.pattern) != null ? _a : "";
    const names = (_c = (_b = options == null ? void 0 : options.names) == null ? void 0 : _b.join(",")) != null ? _c : "";
    return `Field name by pattern: ${pattern} or names: ${names}`;
  }
};
const patternToRegex = (pattern) => {
  if (!pattern) {
    return void 0;
  }
  try {
    return stringToJsRegex(pattern);
  } catch (error) {
    console.error(error);
    return void 0;
  }
};
const frameNameMatcher = {
  id: FrameMatcherID.byName,
  name: "Frame Name",
  description: "match the frame name",
  defaultOptions: "/.*/",
  get: (pattern) => {
    const regex = stringToJsRegex(pattern);
    return (frame) => {
      return regex.test(frame.name || "");
    };
  },
  getOptionsDisplayText: (pattern) => {
    return `Frame name: ${pattern}`;
  }
};
function getFieldNameMatchers() {
  return [
    fieldNameMatcher,
    regexpFieldNameMatcher,
    multipleFieldNamesMatcher,
    regexpOrMultipleNamesMatcher,
    fieldsInFrameMatcher
  ];
}
function getFrameNameMatchers() {
  return [frameNameMatcher];
}

export { ByNamesMatcherMode, fieldNameFallback, getFieldNameMatchers, getFrameNameMatchers };
//# sourceMappingURL=nameMatcher.js.map
