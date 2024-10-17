let factory;
const setQueryRunnerFactory = (instance) => {
  if (factory) {
    throw new Error("Runner should only be set when Grafana is starting.");
  }
  factory = instance;
};
const createQueryRunner = () => {
  if (!factory) {
    throw new Error("`createQueryRunner` can only be used after Grafana instance has started.");
  }
  return factory();
};
let runRequest;
function setRunRequest(fn) {
  if (runRequest && process.env.NODE_ENV !== "test") {
    throw new Error("runRequest function should only be set once, when Grafana is starting.");
  }
  runRequest = fn;
}
function getRunRequest() {
  if (!runRequest) {
    throw new Error("getRunRequest can only be used after Grafana instance has started.");
  }
  return runRequest;
}

export { createQueryRunner, getRunRequest, setQueryRunnerFactory, setRunRequest };
//# sourceMappingURL=QueryRunner.js.map
