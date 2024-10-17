import { useMemo } from 'react';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function resetSelectStyles(theme) {
  return {
    clearIndicator: () => ({}),
    container: () => ({}),
    control: () => ({}),
    dropdownIndicator: () => ({}),
    group: () => ({}),
    groupHeading: () => ({}),
    indicatorsContainer: () => ({}),
    indicatorSeparator: () => ({}),
    input: function(originalStyles) {
      return __spreadProps(__spreadValues({}, originalStyles), {
        color: "inherit",
        margin: 0,
        padding: 0,
        // Set an explicit z-index here to ensure this element always overlays the singleValue
        zIndex: 1,
        overflow: "hidden"
      });
    },
    loadingIndicator: () => ({}),
    loadingMessage: () => ({}),
    menu: () => ({}),
    menuList: ({ maxHeight }) => ({
      maxHeight
    }),
    multiValue: () => ({}),
    multiValueLabel: () => ({
      overflow: "hidden",
      textOverflow: "ellipsis"
    }),
    multiValueRemove: () => ({}),
    noOptionsMessage: () => ({}),
    option: () => ({}),
    placeholder: (originalStyles) => __spreadProps(__spreadValues({}, originalStyles), {
      color: theme.colors.text.secondary
    }),
    singleValue: () => ({}),
    valueContainer: () => ({})
  };
}
function useCustomSelectStyles(theme, width) {
  return useMemo(() => {
    return __spreadProps(__spreadValues({}, resetSelectStyles(theme)), {
      menuPortal: (base) => {
        return __spreadProps(__spreadValues({}, base), {
          zIndex: theme.zIndex.portal
        });
      },
      //These are required for the menu positioning to function
      menu: ({ top, bottom, position }) => {
        return {
          top,
          bottom,
          position,
          minWidth: "100%",
          zIndex: theme.zIndex.dropdown
        };
      },
      container: () => ({
        width: width ? theme.spacing(width) : "100%",
        display: width === "auto" ? "inline-flex" : "flex"
      }),
      option: (provided, state) => __spreadProps(__spreadValues({}, provided), {
        opacity: state.isDisabled ? 0.5 : 1
      })
    });
  }, [theme, width]);
}

export { resetSelectStyles as default, useCustomSelectStyles };
//# sourceMappingURL=resetSelectStyles.js.map
