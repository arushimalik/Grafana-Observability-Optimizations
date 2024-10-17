let singletonInstance;
function setDataSourceSrv(instance) {
  singletonInstance = instance;
}
function getDataSourceSrv() {
  return singletonInstance;
}

export { getDataSourceSrv, setDataSourceSrv };
//# sourceMappingURL=dataSourceSrv.js.map
