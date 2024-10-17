import { fuzzyMatch } from './fuzzy.js';

var SearchFunctionType = /* @__PURE__ */ ((SearchFunctionType2) => {
  SearchFunctionType2["Word"] = "Word";
  SearchFunctionType2["Prefix"] = "Prefix";
  SearchFunctionType2["Fuzzy"] = "Fuzzy";
  return SearchFunctionType2;
})(SearchFunctionType || {});
const wordSearch = (items, text) => {
  return items.filter((c) => (c.filterText || c.label).includes(text));
};
const prefixSearch = (items, text) => {
  return items.filter((c) => (c.filterText || c.label).startsWith(text));
};
const fuzzySearch = (items, text) => {
  text = text.toLowerCase();
  return items.filter((item) => {
    const { distance, ranges, found } = fuzzyMatch(item.label.toLowerCase(), text);
    if (!found) {
      return false;
    }
    item.sortValue = distance;
    item.highlightParts = ranges;
    return true;
  });
};
const SearchFunctionMap = {
  ["Word" /* Word */]: wordSearch,
  ["Prefix" /* Prefix */]: prefixSearch,
  ["Fuzzy" /* Fuzzy */]: fuzzySearch
};

export { SearchFunctionMap, SearchFunctionType };
//# sourceMappingURL=searchFunctions.js.map
