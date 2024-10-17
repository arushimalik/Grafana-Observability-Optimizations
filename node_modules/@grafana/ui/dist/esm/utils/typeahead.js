import calculateSize from 'calculate-size';
import { CompletionItemKind } from '../types/completion.js';

const flattenGroupItems = (groupedItems) => {
  return groupedItems.reduce((all, { items, label }) => {
    all.push({
      label,
      kind: CompletionItemKind.GroupTitle
    });
    return items.reduce((all2, item) => {
      all2.push(item);
      return all2;
    }, all);
  }, []);
};
const calculateLongestLabel = (allItems) => {
  return allItems.reduce((longest, current) => {
    return longest.length < current.label.length ? current.label : longest;
  }, "");
};
const calculateListSizes = (theme, allItems, longestLabel) => {
  const size = calculateSize(longestLabel, {
    font: theme.typography.fontFamilyMonospace,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: "normal"
  });
  const listWidth = calculateListWidth(size.width, theme);
  const itemHeight = calculateItemHeight(size.height, theme);
  const listHeight = calculateListHeight(itemHeight, allItems);
  return {
    listWidth,
    listHeight,
    itemHeight
  };
};
const calculateItemHeight = (longestLabelHeight, theme) => {
  const horizontalPadding = theme.spacing.gridSize * 2;
  const itemHeight = longestLabelHeight + horizontalPadding;
  return itemHeight;
};
const calculateListWidth = (longestLabelWidth, theme) => {
  const verticalPadding = theme.spacing.gridSize * 3;
  const maxWidth = 800;
  const listWidth = Math.min(Math.max(longestLabelWidth + verticalPadding, 200), maxWidth);
  return listWidth;
};
const calculateListHeight = (itemHeight, allItems) => {
  const numberOfItemsToShow = Math.min(allItems.length, 10);
  const minHeight = 100;
  const totalHeight = numberOfItemsToShow * itemHeight;
  const listHeight = Math.max(totalHeight, minHeight);
  return listHeight;
};

export { calculateItemHeight, calculateListHeight, calculateListSizes, calculateListWidth, calculateLongestLabel, flattenGroupItems };
//# sourceMappingURL=typeahead.js.map
