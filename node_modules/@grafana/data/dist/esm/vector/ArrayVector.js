const notice = "ArrayVector is deprecated and will be removed in Grafana 11. Please use plain arrays for field.values.";
let notified = false;
class ArrayVector extends Array {
  get buffer() {
    return this;
  }
  set buffer(values) {
    this.length = 0;
    const len = values == null ? void 0 : values.length;
    if (len) {
      let chonkSize = 65e3;
      let numChonks = Math.ceil(len / chonkSize);
      for (let chonkIdx = 0; chonkIdx < numChonks; chonkIdx++) {
        this.push.apply(this, values.slice(chonkIdx * chonkSize, (chonkIdx + 1) * chonkSize));
      }
    }
  }
  /**
   * ArrayVector is deprecated and should not be used. If you get a Typescript error here, use plain arrays for field.values.
   */
  // `never` is used to force a build-type error from Typescript to encourage developers to move away from using this
  constructor(buffer) {
    super();
    this.buffer = buffer != null ? buffer : [];
    if (!notified) {
      console.warn(notice);
      notified = true;
    }
  }
  toJSON() {
    return [...this];
  }
}

export { ArrayVector };
//# sourceMappingURL=ArrayVector.js.map
