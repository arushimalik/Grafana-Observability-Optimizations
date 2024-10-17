import { Registry } from '../utils/Registry.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class OptionsUIRegistryBuilder {
  constructor() {
    __publicField(this, "properties", []);
  }
  addCustomEditor(config) {
    this.properties.push(config);
    return this;
  }
  getRegistry() {
    return new Registry(() => {
      return this.properties;
    });
  }
  getItems() {
    return this.properties;
  }
}

export { OptionsUIRegistryBuilder };
//# sourceMappingURL=OptionsUIRegistryBuilder.js.map
