import { cloneDeep, isNumber, omit } from 'lodash';
import { fieldReducers, ReducerID, VizOrientation, ThresholdsMode, convertOldAngularValueMappings, FieldColorModeId, validateFieldConfig, sortThresholds } from '@grafana/data';

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
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const optionsToKeep = ["reduceOptions", "orientation"];
function sharedSingleStatPanelChangedHandler(panel, prevPluginId, prevOptions) {
  let options = panel.options;
  panel.fieldConfig = panel.fieldConfig || {
    defaults: {},
    overrides: []
  };
  if (prevPluginId === "singlestat" && prevOptions.angular) {
    return migrateFromAngularSinglestat(panel, prevOptions);
  }
  for (const k of optionsToKeep) {
    if (prevOptions.hasOwnProperty(k)) {
      options[k] = cloneDeep(prevOptions[k]);
    }
  }
  return options;
}
function migrateFromAngularSinglestat(panel, prevOptions) {
  const prevPanel = prevOptions.angular;
  const reducer = fieldReducers.getIfExists(prevPanel.valueName);
  const options = {
    reduceOptions: {
      calcs: [reducer ? reducer.id : ReducerID.mean]
    },
    orientation: VizOrientation.Horizontal
  };
  const defaults = {};
  if (prevPanel.format) {
    defaults.unit = prevPanel.format;
  }
  if (prevPanel.tableColumn) {
    options.reduceOptions.fields = `/^${prevPanel.tableColumn}$/`;
  }
  if (prevPanel.nullPointMode) {
    defaults.nullValueMode = prevPanel.nullPointMode;
  }
  if (prevPanel.nullText) {
    defaults.noValue = prevPanel.nullText;
  }
  if (prevPanel.decimals || prevPanel.decimals === 0) {
    defaults.decimals = prevPanel.decimals;
  }
  if (prevPanel.thresholds && prevPanel.colors) {
    const levels = prevPanel.thresholds.split(",").map((strVale) => {
      return Number(strVale.trim());
    });
    const thresholds = [];
    for (const color of prevPanel.colors) {
      const idx = thresholds.length - 1;
      if (idx >= 0) {
        thresholds.push({ value: levels[idx], color });
      } else {
        thresholds.push({ value: -Infinity, color });
      }
    }
    defaults.thresholds = {
      mode: ThresholdsMode.Absolute,
      steps: thresholds
    };
  }
  const mappings = convertOldAngularValueMappings(prevPanel, defaults.thresholds);
  if (mappings && mappings.length) {
    defaults.mappings = mappings;
  }
  if (prevPanel.gauge && prevPanel.gauge.show) {
    defaults.min = prevPanel.gauge.minValue;
    defaults.max = prevPanel.gauge.maxValue;
  }
  panel.fieldConfig.defaults = defaults;
  return options;
}
function sharedSingleStatMigrationHandler(panel) {
  var _b, _c;
  if (!panel.options) {
    return {};
  }
  const previousVersion = parseFloat(panel.pluginVersion || "6.1");
  let options = panel.options;
  if (previousVersion < 6.2) {
    options = migrateFromValueOptions(options);
  }
  if (previousVersion < 6.3) {
    options = moveThresholdsAndMappingsToField(options);
  }
  const { fieldOptions } = options;
  if (previousVersion < 6.6 && fieldOptions) {
    if (fieldOptions && fieldOptions.override) {
      const _a = options.fieldOptions, rest = __objRest(_a, ["override"]);
      options = __spreadProps(__spreadValues({}, options), {
        fieldOptions: __spreadProps(__spreadValues({}, rest), {
          overrides: []
        })
      });
    }
    let thresholds = (_b = fieldOptions == null ? void 0 : fieldOptions.defaults) == null ? void 0 : _b.thresholds;
    if (thresholds) {
      delete fieldOptions.defaults.thresholds;
    } else {
      thresholds = fieldOptions == null ? void 0 : fieldOptions.thresholds;
      delete fieldOptions.thresholds;
    }
    if (thresholds) {
      fieldOptions.defaults.thresholds = {
        mode: ThresholdsMode.Absolute,
        steps: thresholds
      };
    }
    const { defaults } = fieldOptions;
    if (defaults.color && typeof defaults.color === "string") {
      defaults.color = {
        mode: FieldColorModeId.Fixed,
        fixedColor: defaults.color
      };
    }
    validateFieldConfig(defaults);
  }
  if (previousVersion < 7) {
    panel.fieldConfig = panel.fieldConfig || { defaults: {}, overrides: [] };
    panel.fieldConfig = {
      defaults: fieldOptions && fieldOptions.defaults ? __spreadValues(__spreadValues({}, panel.fieldConfig.defaults), fieldOptions.defaults) : panel.fieldConfig.defaults,
      overrides: fieldOptions && fieldOptions.overrides ? [...panel.fieldConfig.overrides, ...fieldOptions.overrides] : panel.fieldConfig.overrides
    };
    if (fieldOptions) {
      options.reduceOptions = {
        values: fieldOptions.values,
        limit: fieldOptions.limit,
        calcs: fieldOptions.calcs
      };
    }
    delete options.fieldOptions;
  }
  if (previousVersion < 7.1) {
    const oldTitle = panel.fieldConfig.defaults.title;
    if (oldTitle !== void 0 && oldTitle !== null) {
      panel.fieldConfig.defaults.displayName = oldTitle;
      delete panel.fieldConfig.defaults.title;
    }
  }
  if (previousVersion < 8) {
    const config = (_c = panel.fieldConfig) == null ? void 0 : _c.defaults;
    let unit = config == null ? void 0 : config.unit;
    if (unit === "percent") {
      if (!isNumber(config.min)) {
        config.min = 0;
      }
      if (!isNumber(config.max)) {
        config.max = 100;
      }
    } else if (unit === "percentunit") {
      if (!isNumber(config.min)) {
        config.min = 0;
      }
      if (!isNumber(config.max)) {
        config.max = 1;
      }
    }
  }
  return options;
}
function moveThresholdsAndMappingsToField(old) {
  const { fieldOptions } = old;
  if (!fieldOptions) {
    return old;
  }
  const _a = old.fieldOptions, { mappings } = _a, rest = __objRest(_a, ["mappings"]);
  let thresholds = void 0;
  if (old.thresholds) {
    thresholds = {
      mode: ThresholdsMode.Absolute,
      steps: migrateOldThresholds(old.thresholds)
    };
  }
  return __spreadProps(__spreadValues({}, old), {
    fieldOptions: __spreadProps(__spreadValues({}, rest), {
      defaults: __spreadProps(__spreadValues({}, fieldOptions.defaults), {
        mappings,
        thresholds
      })
    })
  });
}
function migrateFromValueOptions(old) {
  const { valueOptions } = old;
  if (!valueOptions) {
    return old;
  }
  const fieldOptions = {};
  const fieldDefaults = {};
  fieldOptions.mappings = old.valueMappings;
  fieldOptions.thresholds = old.thresholds;
  fieldOptions.defaults = fieldDefaults;
  fieldDefaults.unit = valueOptions.unit;
  fieldDefaults.decimals = valueOptions.decimals;
  if (valueOptions.stat) {
    const reducer = fieldReducers.get(valueOptions.stat);
    if (reducer) {
      fieldOptions.calcs = [reducer.id];
    }
  }
  fieldDefaults.min = old.minValue;
  fieldDefaults.max = old.maxValue;
  const newOptions = __spreadProps(__spreadValues({}, old), {
    fieldOptions
  });
  return omit(newOptions, "valueMappings", "thresholds", "valueOptions", "minValue", "maxValue");
}
function migrateOldThresholds(thresholds) {
  if (!thresholds || !thresholds.length) {
    return void 0;
  }
  const copy = thresholds.map((t) => {
    return {
      // Drops 'index'
      value: t.value === null ? -Infinity : t.value,
      color: t.color
    };
  });
  sortThresholds(copy);
  copy[0].value = -Infinity;
  return copy;
}
function convertOldAngularValueMapping(panel) {
  return convertOldAngularValueMappings(panel);
}

export { convertOldAngularValueMapping, migrateFromValueOptions, migrateOldThresholds, moveThresholdsAndMappingsToField, sharedSingleStatMigrationHandler, sharedSingleStatPanelChangedHandler };
//# sourceMappingURL=SingleStatBaseOptions.js.map
