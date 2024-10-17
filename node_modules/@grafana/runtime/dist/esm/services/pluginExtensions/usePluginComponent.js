let singleton;
function setPluginComponentHook(hook) {
  if (singleton && process.env.NODE_ENV !== "test") {
    throw new Error("setPluginComponentHook() function should only be called once, when Grafana is starting.");
  }
  singleton = hook;
}
function usePluginComponent(id) {
  if (!singleton) {
    throw new Error("setPluginComponentHook(options) can only be used after the Grafana instance has started.");
  }
  return singleton(id);
}

export { setPluginComponentHook, usePluginComponent };
//# sourceMappingURL=usePluginComponent.js.map
