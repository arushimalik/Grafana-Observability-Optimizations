export { StreamingFrameAction } from '@grafana/data';

let singletonInstance;
const setGrafanaLiveSrv = (instance) => {
  singletonInstance = instance;
};
const getGrafanaLiveSrv = () => singletonInstance;

export { getGrafanaLiveSrv, setGrafanaLiveSrv };
//# sourceMappingURL=live.js.map
