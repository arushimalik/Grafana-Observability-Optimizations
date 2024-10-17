import { config } from '../config.js';

const featureEnabled = (feature) => {
  const { enabledFeatures } = config.licenseInfo;
  return enabledFeatures && enabledFeatures[feature];
};

export { featureEnabled };
//# sourceMappingURL=licensing.js.map
