let singletonInstance;
const setTemplateSrv = (instance) => {
  singletonInstance = instance;
};
const getTemplateSrv = () => singletonInstance;

export { getTemplateSrv, setTemplateSrv };
//# sourceMappingURL=templateSrv.js.map
