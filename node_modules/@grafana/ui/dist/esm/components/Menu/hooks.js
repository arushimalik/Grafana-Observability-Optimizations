import { useState, useEffect } from 'react';
import { useEffectOnce } from 'react-use';

const modulo = (a, n) => (a % n + n) % n;
const UNFOCUSED = -1;
const useMenuFocus = ({
  localRef,
  isMenuOpen,
  close,
  onOpen,
  onClose,
  onKeyDown
}) => {
  const [focusedItem, setFocusedItem] = useState(UNFOCUSED);
  useEffect(() => {
    if (isMenuOpen) {
      setFocusedItem(0);
    }
  }, [isMenuOpen]);
  useEffect(() => {
    var _a, _b;
    const menuItems = (_a = localRef == null ? void 0 : localRef.current) == null ? void 0 : _a.querySelectorAll(
      '[data-role="menuitem"]:not([data-disabled])'
    );
    (_b = menuItems == null ? void 0 : menuItems[focusedItem]) == null ? void 0 : _b.focus();
    menuItems == null ? void 0 : menuItems.forEach((menuItem, i) => {
      menuItem.tabIndex = i === focusedItem ? 0 : -1;
    });
  }, [localRef, focusedItem]);
  useEffectOnce(() => {
    onOpen == null ? void 0 : onOpen(setFocusedItem);
  });
  const handleKeys = (event) => {
    var _a, _b, _c;
    const menuItems = (_a = localRef == null ? void 0 : localRef.current) == null ? void 0 : _a.querySelectorAll(
      '[data-role="menuitem"]:not([data-disabled])'
    );
    const menuItemsCount = (_b = menuItems == null ? void 0 : menuItems.length) != null ? _b : 0;
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(modulo(focusedItem - 1, menuItemsCount));
        break;
      case "ArrowDown":
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(modulo(focusedItem + 1, menuItemsCount));
        break;
      case "ArrowLeft":
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(UNFOCUSED);
        close == null ? void 0 : close();
        break;
      case "Home":
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(0);
        break;
      case "End":
        event.preventDefault();
        event.stopPropagation();
        setFocusedItem(menuItemsCount - 1);
        break;
      case "Enter":
        event.preventDefault();
        event.stopPropagation();
        (_c = menuItems == null ? void 0 : menuItems[focusedItem]) == null ? void 0 : _c.click();
        break;
      case "Escape":
        onClose == null ? void 0 : onClose();
        break;
      case "Tab":
        event.preventDefault();
        onClose == null ? void 0 : onClose();
        break;
    }
    onKeyDown == null ? void 0 : onKeyDown(event);
  };
  return [handleKeys];
};

export { useMenuFocus };
//# sourceMappingURL=hooks.js.map
