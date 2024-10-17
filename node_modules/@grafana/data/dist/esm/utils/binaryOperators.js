import { Registry } from './Registry.js';

var BinaryOperationID = /* @__PURE__ */ ((BinaryOperationID2) => {
  BinaryOperationID2["Add"] = "+";
  BinaryOperationID2["Subtract"] = "-";
  BinaryOperationID2["Divide"] = "/";
  BinaryOperationID2["Multiply"] = "*";
  return BinaryOperationID2;
})(BinaryOperationID || {});
const binaryOperators = new Registry(() => {
  return [
    {
      id: "+" /* Add */,
      name: "Add",
      operation: (a, b) => a + b,
      binaryOperationID: "+" /* Add */
    },
    {
      id: "-" /* Subtract */,
      name: "Subtract",
      operation: (a, b) => a - b,
      binaryOperationID: "-" /* Subtract */
    },
    {
      id: "*" /* Multiply */,
      name: "Multiply",
      operation: (a, b) => a * b,
      binaryOperationID: "*" /* Multiply */
    },
    {
      id: "/" /* Divide */,
      name: "Divide",
      operation: (a, b) => a / b,
      binaryOperationID: "/" /* Divide */
    }
  ];
});

export { BinaryOperationID, binaryOperators };
//# sourceMappingURL=binaryOperators.js.map
