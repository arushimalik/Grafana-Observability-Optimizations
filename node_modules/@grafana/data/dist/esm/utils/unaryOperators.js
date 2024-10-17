import { Registry } from './Registry.js';

var UnaryOperationID = /* @__PURE__ */ ((UnaryOperationID2) => {
  UnaryOperationID2["Abs"] = "abs";
  UnaryOperationID2["Exp"] = "exp";
  UnaryOperationID2["Ln"] = "ln";
  UnaryOperationID2["Floor"] = "floor";
  UnaryOperationID2["Ceil"] = "ceil";
  return UnaryOperationID2;
})(UnaryOperationID || {});
const unaryOperators = new Registry(() => {
  return [
    {
      id: "abs" /* Abs */,
      name: "Absolute value",
      operation: (value) => Math.abs(value),
      unaryOperationID: "abs" /* Abs */
    },
    {
      id: "exp" /* Exp */,
      name: "Natural exponent",
      operation: (value) => Math.exp(value),
      unaryOperationID: "exp" /* Exp */
    },
    {
      id: "ln" /* Ln */,
      name: "Natural logarithm",
      operation: (value) => Math.log(value),
      unaryOperationID: "ln" /* Ln */
    },
    {
      id: "floor" /* Floor */,
      name: "Floor",
      operation: (value) => Math.floor(value),
      unaryOperationID: "floor" /* Floor */
    },
    {
      id: "ceil" /* Ceil */,
      name: "Ceiling",
      operation: (value) => Math.ceil(value),
      unaryOperationID: "ceil" /* Ceil */
    }
  ];
});

export { UnaryOperationID, unaryOperators };
//# sourceMappingURL=unaryOperators.js.map
