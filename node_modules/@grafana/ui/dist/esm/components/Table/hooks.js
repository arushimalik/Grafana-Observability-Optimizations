import { useEffect } from 'react';

function useFixScrollbarContainer(variableSizeListScrollbarRef, tableDivRef) {
  useEffect(() => {
    var _a;
    if (variableSizeListScrollbarRef.current && tableDivRef.current) {
      const listVerticalScrollbarHTML = variableSizeListScrollbarRef.current.querySelector(".track-vertical");
      const tableScrollbarView = tableDivRef.current.firstChild;
      if (tableScrollbarView && listVerticalScrollbarHTML) {
        listVerticalScrollbarHTML.remove();
        if (tableScrollbarView instanceof HTMLElement) {
          (_a = tableScrollbarView.querySelector(":scope > .track-vertical")) == null ? void 0 : _a.remove();
          tableScrollbarView.append(listVerticalScrollbarHTML);
        }
      }
    }
  });
}
function useResetVariableListSizeCache(extendedState, listRef, data, hasUniqueId) {
  const expandedRowsRepr = JSON.stringify(Object.keys(extendedState.expanded));
  useEffect(() => {
    var _a;
    let resetIndex = 0;
    if (!hasUniqueId) {
      if (Number.isFinite(extendedState.lastExpandedOrCollapsedIndex)) {
        resetIndex = extendedState.lastExpandedOrCollapsedIndex;
      }
      resetIndex = extendedState.pageIndex === 0 ? resetIndex - 1 : resetIndex - extendedState.pageIndex - extendedState.pageIndex * extendedState.pageSize;
    }
    (_a = listRef.current) == null ? void 0 : _a.resetAfterIndex(Math.max(resetIndex, 0));
    return;
  }, [
    extendedState.lastExpandedOrCollapsedIndex,
    extendedState.pageSize,
    extendedState.pageIndex,
    listRef,
    data,
    expandedRowsRepr,
    hasUniqueId
  ]);
}

export { useFixScrollbarContainer, useResetVariableListSizeCache };
//# sourceMappingURL=hooks.js.map
