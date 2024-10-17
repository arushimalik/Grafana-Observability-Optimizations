function renderLegendFormat(aliasPattern, aliasData) {
  const aliasRegex = /\{\{\s*(.+?)\s*\}\}/g;
  return aliasPattern.replace(aliasRegex, (_, g1) => aliasData[g1] ? aliasData[g1] : g1);
}

export { renderLegendFormat };
//# sourceMappingURL=legend.js.map
