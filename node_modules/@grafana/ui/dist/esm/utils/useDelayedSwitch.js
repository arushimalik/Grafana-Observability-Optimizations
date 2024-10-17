import { useState, useRef, useEffect } from 'react';

function useDelayedSwitch(value, options = {}) {
  const { duration = 250, delay = 250 } = options;
  const [delayedValue, setDelayedValue] = useState(value);
  const onStartTime = useRef();
  useEffect(() => {
    let timeout;
    if (value) {
      timeout = setTimeout(() => {
        onStartTime.current = /* @__PURE__ */ new Date();
        setDelayedValue(value);
      }, delay);
    } else {
      const timeSpent = onStartTime.current ? Date.now() - onStartTime.current.valueOf() : 0;
      const turnOff = () => {
        onStartTime.current = void 0;
        setDelayedValue(value);
      };
      if (timeSpent >= duration) {
        turnOff();
      } else {
        timeout = setTimeout(turnOff, duration - timeSpent);
      }
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        timeout = void 0;
      }
    };
  }, [value, duration, delay]);
  return delayedValue;
}

export { useDelayedSwitch };
//# sourceMappingURL=useDelayedSwitch.js.map
