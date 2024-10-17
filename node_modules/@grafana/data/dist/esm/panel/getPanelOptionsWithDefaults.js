import { mergeWith, isArray, isObject, unset, isEqual } from 'lodash';
import { fieldColorModeRegistry } from '../field/fieldColor.js';
import { FieldColorModeId } from '../types/fieldColor.js';
import { FieldConfigProperty } from '../types/fieldOverrides.js';
import { ThresholdsMode } from '../types/thresholds.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function getPanelOptionsWithDefaults({
  plugin,
  currentOptions,
  currentFieldConfig,
  isAfterPluginChange
}) {
  const optionsWithDefaults = mergeWith({}, plugin.defaults, currentOptions || {}, (objValue, srcValue) => {
    if (isArray(srcValue)) {
      return srcValue;
    }
    return;
  });
  const fieldConfigWithDefaults = applyFieldConfigDefaults(currentFieldConfig, plugin);
  const fieldConfigWithOptimalColorMode = adaptFieldColorMode(plugin, fieldConfigWithDefaults, isAfterPluginChange);
  return { options: optionsWithDefaults, fieldConfig: fieldConfigWithOptimalColorMode };
}
function applyFieldConfigDefaults(existingFieldConfig, plugin) {
  var _a;
  const pluginDefaults = plugin.fieldConfigDefaults;
  const result = {
    defaults: mergeWith(
      {},
      pluginDefaults.defaults,
      existingFieldConfig ? existingFieldConfig.defaults : {},
      (objValue, srcValue) => {
        if (isArray(srcValue)) {
          return srcValue;
        }
        return;
      }
    ),
    overrides: (_a = existingFieldConfig == null ? void 0 : existingFieldConfig.overrides) != null ? _a : []
  };
  cleanProperties(result.defaults, "", plugin.fieldConfigRegistry);
  if (result.defaults.thresholds) {
    fixThresholds(result.defaults.thresholds);
  }
  result.overrides = filterFieldConfigOverrides(result.overrides, (prop) => {
    return plugin.fieldConfigRegistry.getIfExists(prop.id) !== void 0;
  });
  for (const override of result.overrides) {
    for (const property of override.properties) {
      if (property.id === "thresholds") {
        fixThresholds(property.value);
      }
    }
  }
  return result;
}
function filterFieldConfigOverrides(overrides, condition) {
  return overrides.map((x) => {
    const properties = x.properties.filter(condition);
    return __spreadProps(__spreadValues({}, x), {
      properties
    });
  });
}
function cleanProperties(obj, parentPath, fieldConfigRegistry) {
  let found = false;
  for (const [propName, value] of Object.entries(obj)) {
    const fullPath = `${parentPath}${propName}`;
    const existsInRegistry = !!fieldConfigRegistry.getIfExists(fullPath);
    if (existsInRegistry) {
      found = true;
      continue;
    }
    if (isArray(value) || !isObject(value)) {
      if (!existsInRegistry) {
        unset(obj, propName);
      }
    } else {
      const childPropFound = cleanProperties(value, `${fullPath}.`, fieldConfigRegistry);
      if (!childPropFound) {
        unset(obj, propName);
      }
    }
  }
  return found;
}
function adaptFieldColorMode(plugin, fieldConfig, isAfterPluginChange) {
  var _a;
  if (!isAfterPluginChange) {
    return fieldConfig;
  }
  const color = plugin.fieldConfigRegistry.getIfExists(FieldConfigProperty.Color);
  if (color && color.settings) {
    const colorSettings = color.settings;
    const mode = fieldColorModeRegistry.getIfExists((_a = fieldConfig.defaults.color) == null ? void 0 : _a.mode);
    if (!colorSettings.byValueSupport) {
      if (!mode || mode.isByValue) {
        fieldConfig.defaults.color = { mode: FieldColorModeId.PaletteClassic };
        return fieldConfig;
      }
    }
    if (colorSettings.byValueSupport && colorSettings.preferThresholdsMode && (mode == null ? void 0 : mode.id) !== FieldColorModeId.Fixed) {
      if (!mode || !mode.isByValue) {
        fieldConfig.defaults.color = { mode: FieldColorModeId.Thresholds };
        return fieldConfig;
      }
    }
    if (colorSettings.bySeriesSupport && (mode == null ? void 0 : mode.isByValue)) {
      fieldConfig.defaults.color = { mode: FieldColorModeId.PaletteClassic };
      return fieldConfig;
    }
  }
  return fieldConfig;
}
function fixThresholds(thresholds) {
  if (!thresholds.mode) {
    thresholds.mode = ThresholdsMode.Absolute;
  }
  if (!thresholds.steps) {
    thresholds.steps = [];
  } else if (thresholds.steps.length) {
    thresholds.steps[0].value = -Infinity;
  }
}
function restoreCustomOverrideRules(current, old) {
  const result = {
    defaults: __spreadProps(__spreadValues({}, current.defaults), {
      custom: old.defaults.custom
    }),
    overrides: [...current.overrides]
  };
  for (const override of old.overrides) {
    for (const prop of override.properties) {
      if (isCustomFieldProp(prop)) {
        const currentOverride = result.overrides.find((o) => isEqual(o.matcher, override.matcher));
        if (currentOverride) {
          if (currentOverride !== override) {
            currentOverride.properties.push(prop);
          }
        } else {
          result.overrides.push(override);
        }
      }
    }
  }
  return result;
}
function isCustomFieldProp(prop) {
  return prop.id.startsWith("custom.");
}
function isStandardFieldProp(prop) {
  return !isCustomFieldProp(prop);
}

export { filterFieldConfigOverrides, getPanelOptionsWithDefaults, isCustomFieldProp, isStandardFieldProp, restoreCustomOverrideRules };
//# sourceMappingURL=getPanelOptionsWithDefaults.js.map
