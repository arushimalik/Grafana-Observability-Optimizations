let singletonInstance;
function setLocationSrv(instance) {
  singletonInstance = instance;
}
function getLocationSrv() {
  return singletonInstance;
}

export { getLocationSrv, setLocationSrv };
//# sourceMappingURL=LocationSrv.js.map
