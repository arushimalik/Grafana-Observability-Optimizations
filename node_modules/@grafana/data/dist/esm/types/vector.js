function patchArrayVectorProrotypeMethods() {
  if (!Object.getOwnPropertyDescriptor(Array.prototype, "toArray")) {
    Object.defineProperties(Array.prototype, {
      get: {
        value: function(idx) {
          return this[idx];
        },
        writable: true,
        enumerable: false,
        configurable: true
      },
      set: {
        value: function(idx, value) {
          this[idx] = value;
        },
        writable: true,
        enumerable: false,
        configurable: true
      },
      add: {
        value: function(value) {
          this.push(value);
        },
        writable: true,
        enumerable: false,
        configurable: true
      },
      toArray: {
        value: function() {
          return this;
        },
        writable: true,
        enumerable: false,
        configurable: true
      }
    });
  }
}
patchArrayVectorProrotypeMethods();

export { patchArrayVectorProrotypeMethods };
//# sourceMappingURL=vector.js.map
