import { isEmpty } from 'lodash';
import { DefaultTimeZone } from '../types/time.js';

let defaultTimeZoneResolver = () => DefaultTimeZone;
const setTimeZoneResolver = (resolver) => {
  defaultTimeZoneResolver = resolver != null ? resolver : defaultTimeZoneResolver;
};
const getTimeZone = (options) => {
  var _a;
  if ((options == null ? void 0 : options.timeZone) && !isEmpty(options.timeZone)) {
    return options.timeZone;
  }
  return (_a = defaultTimeZoneResolver()) != null ? _a : DefaultTimeZone;
};

export { getTimeZone, setTimeZoneResolver };
//# sourceMappingURL=common.js.map
