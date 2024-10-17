import { Registry } from '../utils/Registry.js';

var TransformerCategory = /* @__PURE__ */ ((TransformerCategory2) => {
  TransformerCategory2["Combine"] = "combine";
  TransformerCategory2["CalculateNewFields"] = "calculateNewFields";
  TransformerCategory2["CreateNewVisualization"] = "createNewVisualization";
  TransformerCategory2["Filter"] = "filter";
  TransformerCategory2["PerformSpatialOperations"] = "performSpatialOperations";
  TransformerCategory2["Reformat"] = "reformat";
  TransformerCategory2["ReorderAndRename"] = "reorderAndRename";
  return TransformerCategory2;
})(TransformerCategory || {});
const standardTransformersRegistry = new Registry();

export { TransformerCategory, standardTransformersRegistry };
//# sourceMappingURL=standardTransformersRegistry.js.map
