const SEARCH_FILTER_VARIABLE = "__searchFilter";
const containsSearchFilter = (query) => query && typeof query === "string" ? query.indexOf(SEARCH_FILTER_VARIABLE) !== -1 : false;
const getSearchFilterScopedVar = (args) => {
  const { query, wildcardChar } = args;
  if (!containsSearchFilter(query)) {
    return {};
  }
  let { options } = args;
  options = options || { searchFilter: "" };
  const value = options.searchFilter ? `${options.searchFilter}${wildcardChar}` : `${wildcardChar}`;
  return {
    __searchFilter: {
      value,
      text: ""
    }
  };
};

export { containsSearchFilter, getSearchFilterScopedVar };
//# sourceMappingURL=variables.js.map
