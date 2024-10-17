function isFetchError(e) {
  return typeof e === "object" && e !== null && "status" in e && "data" in e;
}
let singletonInstance;
const setBackendSrv = (instance) => {
  singletonInstance = instance;
};
const getBackendSrv = () => singletonInstance;

export { getBackendSrv, isFetchError, setBackendSrv };
//# sourceMappingURL=backendSrv.js.map
