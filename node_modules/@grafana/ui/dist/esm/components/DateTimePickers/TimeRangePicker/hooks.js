import { useState, useEffect } from 'react';

const modulo = (a, n) => (a % n + n) % n;
const CAUGHT_KEYS = ["ArrowUp", "ArrowDown", "Home", "End", "Enter", "Tab"];
const useListFocus = ({ localRef, options }) => {
  const [focusedItem, setFocusedItem] = useState(0);
  useEffect(() => {
    var _a;
    const items = ((_a = localRef.current) == null ? void 0 : _a.querySelectorAll('[data-role="item"]')) || [];
    const checkedIndex = Array.from(items).findIndex((item) => item.checked);
    const newFocusedIndex = checkedIndex >= 0 ? checkedIndex : 0;
    items.forEach((item, i) => {
      item.tabIndex = i === newFocusedIndex ? 0 : -1;
    });
    setFocusedItem(newFocusedIndex);
  }, [localRef, options]);
  const handleKeys = (event) => {
    var _a, _b, _c, _d;
    const items = (_a = localRef == null ? void 0 : localRef.current) == null ? void 0 : _a.querySelectorAll('[data-role="item"]');
    const itemsCount = (_b = items == null ? void 0 : items.length) != null ? _b : 0;
    if (CAUGHT_KEYS.indexOf(event.key) > -1) {
      event.preventDefault();
      if (event.key !== "Tab") {
        event.stopPropagation();
      }
    }
    let newFocusedIndex = null;
    switch (event.key) {
      case "ArrowUp":
        newFocusedIndex = modulo(focusedItem - 1, itemsCount);
        break;
      case "ArrowDown":
        newFocusedIndex = modulo(focusedItem + 1, itemsCount);
        break;
      case "Home":
        newFocusedIndex = 0;
        break;
      case "End":
        newFocusedIndex = itemsCount - 1;
        break;
      case "Enter":
        (_c = items == null ? void 0 : items[focusedItem]) == null ? void 0 : _c.click();
        break;
    }
    if (newFocusedIndex !== null) {
      setFocusedItem(newFocusedIndex);
      (_d = items == null ? void 0 : items[newFocusedIndex]) == null ? void 0 : _d.focus();
      items == null ? void 0 : items.forEach((item, i) => {
        item.tabIndex = i === newFocusedIndex ? 0 : -1;
      });
    }
  };
  return [handleKeys];
};

export { useListFocus };
//# sourceMappingURL=hooks.js.map
