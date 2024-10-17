function matchPluginId(idToMatch, pluginMeta) {
  if (pluginMeta.id === idToMatch) {
    return true;
  }
  if (pluginMeta.aliasIDs) {
    return pluginMeta.aliasIDs.includes(idToMatch);
  }
  return false;
}

export { matchPluginId };
//# sourceMappingURL=matchPluginId.js.map
