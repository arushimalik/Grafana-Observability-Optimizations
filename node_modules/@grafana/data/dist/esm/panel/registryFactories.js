import { FieldConfigOptionsRegistry } from '../field/FieldConfigOptionsRegistry.js';
import { standardFieldConfigEditorRegistry } from '../field/standardFieldConfigEditorRegistry.js';
import { FieldConfigEditorBuilder } from '../utils/OptionsUIBuilders.js';

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
function createFieldConfigRegistry(config = {}, pluginName) {
  var _a, _b, _c, _d;
  const registry = new FieldConfigOptionsRegistry();
  const standardConfigs = standardFieldConfigEditorRegistry.list();
  const standardOptionsExtensions = {};
  if (config.useCustomConfig) {
    const builder = new FieldConfigEditorBuilder();
    config.useCustomConfig(builder);
    for (const customProp of builder.getRegistry().list()) {
      customProp.isCustom = true;
      customProp.id = "custom." + customProp.id;
      if (isStandardConfigExtension(customProp, standardConfigs)) {
        const currentExtensions = (_a = standardOptionsExtensions[customProp.category[0]]) != null ? _a : [];
        currentExtensions.push(customProp);
        standardOptionsExtensions[customProp.category[0]] = currentExtensions;
      } else {
        registry.register(customProp);
      }
    }
  }
  for (let fieldConfigProp of standardConfigs) {
    const id = fieldConfigProp.id;
    if (config.disableStandardOptions) {
      const isDisabled = config.disableStandardOptions.indexOf(id) > -1;
      if (isDisabled) {
        continue;
      }
    }
    if (config.standardOptions) {
      const customHideFromDefaults = (_b = config.standardOptions[id]) == null ? void 0 : _b.hideFromDefaults;
      const customDefault = (_c = config.standardOptions[id]) == null ? void 0 : _c.defaultValue;
      const customSettings = (_d = config.standardOptions[id]) == null ? void 0 : _d.settings;
      if (customHideFromDefaults) {
        fieldConfigProp = __spreadProps(__spreadValues({}, fieldConfigProp), {
          hideFromDefaults: customHideFromDefaults
        });
      }
      if (customDefault) {
        fieldConfigProp = __spreadProps(__spreadValues({}, fieldConfigProp), {
          defaultValue: customDefault
        });
      }
      if (customSettings) {
        fieldConfigProp = __spreadProps(__spreadValues({}, fieldConfigProp), {
          settings: fieldConfigProp.settings ? __spreadValues(__spreadValues({}, fieldConfigProp.settings), customSettings) : customSettings
        });
      }
    }
    registry.register(fieldConfigProp);
    if (fieldConfigProp.category && standardOptionsExtensions[fieldConfigProp.category[0]]) {
      for (let extensionProperty of standardOptionsExtensions[fieldConfigProp.category[0]]) {
        registry.register(extensionProperty);
      }
    }
  }
  for (const item of registry.list()) {
    if (item.path.indexOf("[") > 0) {
      throw new Error(`[${pluginName}] Field config paths do not support arrays: ${item.id}`);
    }
  }
  return registry;
}
function isStandardConfigExtension(property, standardProperties) {
  return Boolean(
    standardProperties.find((p) => property.category && p.category && property.category[0] === p.category[0])
  );
}

export { createFieldConfigRegistry };
//# sourceMappingURL=registryFactories.js.map
