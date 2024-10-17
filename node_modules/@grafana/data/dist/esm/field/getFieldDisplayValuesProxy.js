import { toNumber } from 'lodash';
import { formattedValueToString } from '../valueFormats/valueFormats.js';
import { getDisplayProcessor } from './displayProcessor.js';

function getFieldDisplayValuesProxy(options) {
  return new Proxy(
    {},
    {
      get: (obj, key) => {
        var _a;
        let field = options.frame.fields.find((f) => key === f.name);
        if (!field) {
          const k = toNumber(key);
          field = options.frame.fields[k];
        }
        if (!field) {
          field = options.frame.fields.find((f) => key === f.config.displayName);
        }
        if (!field) {
          field = options.frame.fields.find((f) => {
            if (f.labels) {
              return key === f.labels.name;
            }
            return false;
          });
        }
        if (!field) {
          return void 0;
        }
        const displayProcessor = (_a = field.display) != null ? _a : getDisplayProcessor();
        const raw = field.values[options.rowIndex];
        const disp = displayProcessor(raw);
        disp.toString = () => formattedValueToString(disp);
        return disp;
      }
    }
  );
}

export { getFieldDisplayValuesProxy };
//# sourceMappingURL=getFieldDisplayValuesProxy.js.map
