function isDataSourcePluginContext(context) {
  return "instanceSettings" in context && "meta" in context;
}

export { isDataSourcePluginContext };
//# sourceMappingURL=guards.js.map
