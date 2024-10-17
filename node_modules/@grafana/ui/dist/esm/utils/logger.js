import { throttle } from 'lodash';

const throttledLog = throttle((...t) => {
  console.log(...t);
}, 500);
const createLogger = (name) => {
  let loggingEnabled = false;
  if (typeof window !== "undefined") {
    loggingEnabled = window.localStorage.getItem("grafana.debug") === "true";
  }
  return {
    logger: (id, throttle2 = false, ...t) => {
      if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test" || !loggingEnabled) {
        return;
      }
      const fn = throttle2 ? throttledLog : console.log;
      fn(`[${name}: ${id}]:`, ...t);
    },
    enable: () => loggingEnabled = true,
    disable: () => loggingEnabled = false,
    isEnabled: () => loggingEnabled
  };
};

export { createLogger };
//# sourceMappingURL=logger.js.map
