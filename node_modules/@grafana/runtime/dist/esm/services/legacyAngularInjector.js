let singleton;
const setLegacyAngularInjector = (instance) => {
  singleton = instance;
};
const getLegacyAngularInjector = () => singleton;

export { getLegacyAngularInjector, setLegacyAngularInjector };
//# sourceMappingURL=legacyAngularInjector.js.map
