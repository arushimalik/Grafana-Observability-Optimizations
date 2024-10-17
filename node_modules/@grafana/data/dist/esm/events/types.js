var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class BusEventBase {
  constructor() {
    __publicField(this, "type");
    __publicField(this, "payload");
    __publicField(this, "origin");
    /** @internal */
    __publicField(this, "tags");
    this.type = this.__proto__.constructor.type;
  }
  /**
   * @internal
   * Tag event for finer-grained filtering in subscribers
   */
  setTags(tags) {
    this.tags = new Set(tags);
    return this;
  }
}
class BusEventWithPayload extends BusEventBase {
  constructor(payload) {
    super();
    __publicField(this, "payload");
    this.payload = payload;
  }
}

export { BusEventBase, BusEventWithPayload };
//# sourceMappingURL=types.js.map
