import { defaultsDeep } from 'lodash';
import { FieldType } from './dataFrame.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var VizOrientation = /* @__PURE__ */ ((VizOrientation2) => {
  VizOrientation2["Auto"] = "auto";
  VizOrientation2["Vertical"] = "vertical";
  VizOrientation2["Horizontal"] = "horizontal";
  return VizOrientation2;
})(VizOrientation || {});
var VisualizationSuggestionScore = /* @__PURE__ */ ((VisualizationSuggestionScore2) => {
  VisualizationSuggestionScore2[VisualizationSuggestionScore2["Best"] = 100] = "Best";
  VisualizationSuggestionScore2[VisualizationSuggestionScore2["Good"] = 70] = "Good";
  VisualizationSuggestionScore2[VisualizationSuggestionScore2["OK"] = 50] = "OK";
  return VisualizationSuggestionScore2;
})(VisualizationSuggestionScore || {});
class VisualizationSuggestionsBuilder {
  constructor(data, panel) {
    /** Current data */
    __publicField(this, "data");
    /** Current panel & options */
    __publicField(this, "panel");
    /** Summary stats for current data */
    __publicField(this, "dataSummary");
    __publicField(this, "list", []);
    this.data = data;
    this.panel = panel;
    this.dataSummary = this.computeDataSummary();
  }
  getListAppender(defaults) {
    return new VisualizationSuggestionsListAppender(this.list, defaults);
  }
  computeDataSummary() {
    var _a, _b;
    const frames = ((_a = this.data) == null ? void 0 : _a.series) || [];
    let numberFieldCount = 0;
    let timeFieldCount = 0;
    let stringFieldCount = 0;
    let rowCountTotal = 0;
    let rowCountMax = 0;
    let fieldCount = 0;
    let preferredVisualisationType;
    for (const frame of frames) {
      rowCountTotal += frame.length;
      if ((_b = frame.meta) == null ? void 0 : _b.preferredVisualisationType) {
        preferredVisualisationType = frame.meta.preferredVisualisationType;
      }
      for (const field of frame.fields) {
        fieldCount++;
        switch (field.type) {
          case FieldType.number:
            numberFieldCount += 1;
            break;
          case FieldType.time:
            timeFieldCount += 1;
            break;
          case FieldType.string:
            stringFieldCount += 1;
            break;
        }
      }
      if (frame.length > rowCountMax) {
        rowCountMax = frame.length;
      }
    }
    return {
      numberFieldCount,
      timeFieldCount,
      stringFieldCount,
      rowCountTotal,
      rowCountMax,
      fieldCount,
      preferredVisualisationType,
      frameCount: frames.length,
      hasData: rowCountTotal > 0,
      hasTimeField: timeFieldCount > 0,
      hasNumberField: numberFieldCount > 0,
      hasStringField: stringFieldCount > 0
    };
  }
  getList() {
    return this.list;
  }
}
class VisualizationSuggestionsListAppender {
  constructor(list, defaults) {
    this.list = list;
    this.defaults = defaults;
  }
  append(overrides) {
    this.list.push(defaultsDeep(overrides, this.defaults));
  }
}

export { VisualizationSuggestionScore, VisualizationSuggestionsBuilder, VisualizationSuggestionsListAppender, VizOrientation };
//# sourceMappingURL=panel.js.map
