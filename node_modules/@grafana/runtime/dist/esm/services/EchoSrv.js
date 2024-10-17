var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var EchoEventType = /* @__PURE__ */ ((EchoEventType2) => {
  EchoEventType2["Performance"] = "performance";
  EchoEventType2["MetaAnalytics"] = "meta-analytics";
  EchoEventType2["Pageview"] = "pageview";
  EchoEventType2["Interaction"] = "interaction";
  EchoEventType2["ExperimentView"] = "experimentview";
  EchoEventType2["GrafanaJavascriptAgent"] = "grafana-javascript-agent";
  return EchoEventType2;
})(EchoEventType || {});
let singletonInstance;
function setEchoSrv(instance) {
  if (singletonInstance instanceof FakeEchoSrv) {
    for (const item of singletonInstance.buffer) {
      instance.addEvent(item.event, item.meta);
    }
  }
  singletonInstance = instance;
}
function getEchoSrv() {
  if (!singletonInstance) {
    singletonInstance = new FakeEchoSrv();
  }
  return singletonInstance;
}
const registerEchoBackend = (backend) => {
  getEchoSrv().addBackend(backend);
};
class FakeEchoSrv {
  constructor() {
    __publicField(this, "buffer", []);
  }
  flush() {
    this.buffer = [];
  }
  addBackend(backend) {
  }
  addEvent(event, meta) {
    this.buffer.push({ event, meta });
  }
}

export { EchoEventType, FakeEchoSrv, getEchoSrv, registerEchoBackend, setEchoSrv };
//# sourceMappingURL=EchoSrv.js.map
