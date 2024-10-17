import { useMemo } from 'react';
import { isPluginExtensionLink, isPluginExtensionComponent } from './utils.js';

let singleton;
function setPluginExtensionsHook(hook) {
  if (singleton && process.env.NODE_ENV !== "test") {
    throw new Error("setPluginExtensionsHook() function should only be called once, when Grafana is starting.");
  }
  singleton = hook;
}
function usePluginExtensions(options) {
  if (!singleton) {
    throw new Error("usePluginExtensions(options) can only be used after the Grafana instance has started.");
  }
  return singleton(options);
}
function usePluginLinks(options) {
  const { extensions, isLoading } = usePluginExtensions(options);
  return useMemo(() => {
    return {
      links: extensions.filter(isPluginExtensionLink),
      isLoading
    };
  }, [extensions, isLoading]);
}
function usePluginComponents(options) {
  const { extensions, isLoading } = usePluginExtensions(options);
  return useMemo(
    () => ({
      components: extensions.filter(isPluginExtensionComponent).map(({ component }) => component),
      isLoading
    }),
    [extensions, isLoading]
  );
}
function usePluginLinkExtensions(options) {
  const { extensions, isLoading } = usePluginExtensions(options);
  return useMemo(() => {
    return {
      extensions: extensions.filter(isPluginExtensionLink),
      isLoading
    };
  }, [extensions, isLoading]);
}
function usePluginComponentExtensions(options) {
  const { extensions, isLoading } = usePluginExtensions(options);
  return useMemo(
    () => ({
      extensions: extensions.filter(isPluginExtensionComponent),
      isLoading
    }),
    [extensions, isLoading]
  );
}

export { setPluginExtensionsHook, usePluginComponentExtensions, usePluginComponents, usePluginExtensions, usePluginLinkExtensions, usePluginLinks };
//# sourceMappingURL=usePluginExtensions.js.map
