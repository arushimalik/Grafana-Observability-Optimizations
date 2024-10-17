import { SortOrder } from '@grafana/schema';

function moveItemImmutably(arr, from, to) {
  const clone = [...arr];
  Array.prototype.splice.call(clone, to, 0, Array.prototype.splice.call(clone, from, 1)[0]);
  return clone;
}
function insertBeforeImmutably(array, item, index) {
  if (index < 0 || index > array.length) {
    throw new Error("Index out of bounds");
  }
  const clone = [...array];
  clone.splice(index, 0, item);
  return clone;
}
function insertAfterImmutably(array, item, index) {
  if (index < 0 || index > array.length) {
    throw new Error("Index out of bounds");
  }
  const clone = [...array];
  clone.splice(index + 1, 0, item);
  return clone;
}
const collator = new Intl.Collator(void 0, { numeric: true, sensitivity: "base" });
const numericCompare = (a, b) => a - b;
function sortValues(sort) {
  return (a, b) => {
    if (a === b) {
      return 0;
    }
    if (b == null || typeof b === "string" && b.trim() === "") {
      return -1;
    }
    if (a == null || typeof a === "string" && (a == null ? void 0 : a.trim()) === "") {
      return 1;
    }
    let compareFn = collator.compare;
    if (typeof a === "number" && typeof b === "number") {
      compareFn = numericCompare;
    }
    if (sort === SortOrder.Descending) {
      return compareFn(b, a);
    }
    return compareFn(a, b);
  };
}

export { insertAfterImmutably, insertBeforeImmutably, moveItemImmutably, sortValues };
//# sourceMappingURL=arrayUtils.js.map
