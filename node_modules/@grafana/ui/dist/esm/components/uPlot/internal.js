import { AxisPlacement, ScaleDistribution } from '@grafana/schema';
import { FIXED_UNIT } from './types.js';

function buildScaleKey(config, fieldType) {
  var _a, _b, _c, _d, _e, _f, _g;
  const defaultPart = "na";
  const scaleRange = `${config.min !== void 0 ? config.min : defaultPart}-${config.max !== void 0 ? config.max : defaultPart}`;
  const scaleSoftRange = `${((_a = config.custom) == null ? void 0 : _a.axisSoftMin) !== void 0 ? config.custom.axisSoftMin : defaultPart}-${((_b = config.custom) == null ? void 0 : _b.axisSoftMax) !== void 0 ? config.custom.axisSoftMax : defaultPart}`;
  const scalePlacement = `${((_c = config.custom) == null ? void 0 : _c.axisPlacement) !== void 0 ? (_d = config.custom) == null ? void 0 : _d.axisPlacement : AxisPlacement.Auto}`;
  const scaleUnit = (_e = config.unit) != null ? _e : FIXED_UNIT;
  const scaleDistribution = ((_f = config.custom) == null ? void 0 : _f.scaleDistribution) ? getScaleDistributionPart(config.custom.scaleDistribution) : ScaleDistribution.Linear;
  const scaleLabel = Boolean((_g = config.custom) == null ? void 0 : _g.axisLabel) ? config.custom.axisLabel : defaultPart;
  return `${scaleUnit}/${scaleRange}/${scaleSoftRange}/${scalePlacement}/${scaleDistribution}/${scaleLabel}/${fieldType}`;
}
function getScaleDistributionPart(config) {
  if (config.type === ScaleDistribution.Log) {
    return `${config.type}${config.log}`;
  }
  return config.type;
}

export { buildScaleKey };
//# sourceMappingURL=internal.js.map
