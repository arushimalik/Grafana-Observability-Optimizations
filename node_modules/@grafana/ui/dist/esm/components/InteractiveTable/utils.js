import { ExpanderHeader, ExpanderCell } from './Expander/index.js';

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
const EXPANDER_CELL_ID = "__expander";
function getColumns(columns, showExpandAll = false) {
  return [
    __spreadProps(__spreadValues({
      id: EXPANDER_CELL_ID,
      Cell: ExpanderCell
    }, showExpandAll && {
      Header: ExpanderHeader
    }), {
      disableSortBy: true,
      width: 0
    }),
    // @ts-expect-error react-table expects each column key(id) to have data associated with it and therefore complains about
    // column.id being possibly undefined and not keyof T (where T is the data object)
    // We do not want to be that strict as we simply pass undefined to cells that do not have data associated with them.
    ...columns.map((column) => __spreadValues({
      id: column.id,
      accessor: column.id,
      Header: column.header || (() => null),
      sortType: column.sortType || "alphanumeric",
      disableSortBy: !Boolean(column.sortType),
      width: column.disableGrow ? 0 : void 0,
      visible: column.visible
    }, column.cell && { Cell: column.cell }))
  ];
}

export { EXPANDER_CELL_ID, getColumns };
//# sourceMappingURL=utils.js.map
