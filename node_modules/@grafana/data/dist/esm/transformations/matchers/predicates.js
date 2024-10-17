import { FieldType } from '../../types/dataFrame.js';
import { getFieldMatcher, fieldMatchers, getFrameMatchers, frameMatchers } from '../matchers.js';
import { MatcherID } from './ids.js';

const anyFieldMatcher = {
  id: MatcherID.anyMatch,
  name: "Any",
  description: "Any child matches (OR)",
  excludeFromPicker: true,
  defaultOptions: [],
  // empty array
  get: (options) => {
    const children = options.map((option) => {
      return getFieldMatcher(option);
    });
    return (field, frame, allFrames) => {
      for (const child of children) {
        if (child(field, frame, allFrames)) {
          return true;
        }
      }
      return false;
    };
  },
  getOptionsDisplayText: (options) => {
    let text = "";
    for (const sub of options) {
      if (text.length > 0) {
        text += " OR ";
      }
      const matcher = fieldMatchers.get(sub.id);
      text += matcher.getOptionsDisplayText ? matcher.getOptionsDisplayText(sub) : matcher.name;
    }
    return text;
  }
};
const anyFrameMatcher = {
  id: MatcherID.anyMatch,
  name: "Any",
  description: "Any child matches (OR)",
  excludeFromPicker: true,
  defaultOptions: [],
  // empty array
  get: (options) => {
    const children = options.map((option) => {
      return getFrameMatchers(option);
    });
    return (frame) => {
      for (const child of children) {
        if (child(frame)) {
          return true;
        }
      }
      return false;
    };
  },
  getOptionsDisplayText: (options) => {
    let text = "";
    for (const sub of options) {
      if (text.length > 0) {
        text += " OR ";
      }
      const matcher = frameMatchers.get(sub.id);
      text += matcher.getOptionsDisplayText ? matcher.getOptionsDisplayText(sub) : matcher.name;
    }
    return text;
  }
};
const allFieldsMatcher = {
  id: MatcherID.allMatch,
  name: "All",
  description: "Everything matches (AND)",
  excludeFromPicker: true,
  defaultOptions: [],
  // empty array
  get: (options) => {
    const children = options.map((option) => {
      return getFieldMatcher(option);
    });
    return (field, frame, allFrames) => {
      for (const child of children) {
        if (!child(field, frame, allFrames)) {
          return false;
        }
      }
      return true;
    };
  },
  getOptionsDisplayText: (options) => {
    let text = "";
    for (const sub of options) {
      if (text.length > 0) {
        text += " AND ";
      }
      const matcher = fieldMatchers.get(sub.id);
      text += matcher.getOptionsDisplayText ? matcher.getOptionsDisplayText(sub) : matcher.name;
    }
    return text;
  }
};
const allFramesMatcher = {
  id: MatcherID.allMatch,
  name: "All",
  description: "Everything matches (AND)",
  excludeFromPicker: true,
  defaultOptions: [],
  // empty array
  get: (options) => {
    const children = options.map((option) => {
      return getFrameMatchers(option);
    });
    return (frame) => {
      for (const child of children) {
        if (!child(frame)) {
          return false;
        }
      }
      return true;
    };
  },
  getOptionsDisplayText: (options) => {
    let text = "";
    for (const sub of options) {
      if (text.length > 0) {
        text += " AND ";
      }
      const matcher = frameMatchers.get(sub.id);
      text += matcher.getOptionsDisplayText ? matcher.getOptionsDisplayText(sub) : matcher.name;
    }
    return text;
  }
};
const notFieldMatcher = {
  id: MatcherID.invertMatch,
  name: "NOT",
  description: "Inverts other matchers",
  excludeFromPicker: true,
  get: (option) => {
    const check = getFieldMatcher(option);
    return (field, frame, allFrames) => {
      return !check(field, frame, allFrames);
    };
  },
  getOptionsDisplayText: (options) => {
    const matcher = fieldMatchers.get(options.id);
    const text = matcher.getOptionsDisplayText ? matcher.getOptionsDisplayText(options.options) : matcher.name;
    return "NOT " + text;
  }
};
const notFrameMatcher = {
  id: MatcherID.invertMatch,
  name: "NOT",
  description: "Inverts other matchers",
  excludeFromPicker: true,
  get: (option) => {
    const check = getFrameMatchers(option);
    return (frame) => {
      return !check(frame);
    };
  },
  getOptionsDisplayText: (options) => {
    const matcher = frameMatchers.get(options.id);
    const text = matcher.getOptionsDisplayText ? matcher.getOptionsDisplayText(options.options) : matcher.name;
    return "NOT " + text;
  }
};
const alwaysFieldMatcher = (field) => {
  return true;
};
const alwaysFrameMatcher = (frame) => {
  return true;
};
const neverFieldMatcher = (field) => {
  return false;
};
const notTimeFieldMatcher = (field) => {
  return field.type !== FieldType.time;
};
const neverFrameMatcher = (frame) => {
  return false;
};
const alwaysFieldMatcherInfo = {
  id: MatcherID.alwaysMatch,
  name: "All Fields",
  description: "Always Match",
  get: (_option) => {
    return alwaysFieldMatcher;
  },
  getOptionsDisplayText: (_options) => {
    return "Always";
  }
};
const alwaysFrameMatcherInfo = {
  id: MatcherID.alwaysMatch,
  name: "All Frames",
  description: "Always Match",
  get: (_option) => {
    return alwaysFrameMatcher;
  },
  getOptionsDisplayText: (_options) => {
    return "Always";
  }
};
const neverFieldMatcherInfo = {
  id: MatcherID.neverMatch,
  name: "No Fields",
  description: "Never Match",
  excludeFromPicker: true,
  get: (_option) => {
    return neverFieldMatcher;
  },
  getOptionsDisplayText: (_options) => {
    return "Never";
  }
};
const neverFrameMatcherInfo = {
  id: MatcherID.neverMatch,
  name: "No Frames",
  description: "Never Match",
  get: (_option) => {
    return neverFrameMatcher;
  },
  getOptionsDisplayText: (_options) => {
    return "Never";
  }
};
function getFieldPredicateMatchers() {
  return [anyFieldMatcher, allFieldsMatcher, notFieldMatcher, alwaysFieldMatcherInfo, neverFieldMatcherInfo];
}
function getFramePredicateMatchers() {
  return [anyFrameMatcher, allFramesMatcher, notFrameMatcher, alwaysFrameMatcherInfo, neverFrameMatcherInfo];
}

export { alwaysFieldMatcher, getFieldPredicateMatchers, getFramePredicateMatchers, notTimeFieldMatcher };
//# sourceMappingURL=predicates.js.map
