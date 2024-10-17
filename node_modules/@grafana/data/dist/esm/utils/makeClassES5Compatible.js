function makeClassES5Compatible(ES6Class) {
  return new Proxy(ES6Class, {
    // ES5 code will call it like a function using super
    apply(target, self, argumentsList) {
      if (typeof Reflect === "undefined" || !Reflect.construct) {
        alert("Browser is too old");
      }
      return Reflect.construct(target, argumentsList, self.constructor);
    }
  });
}

export { makeClassES5Compatible };
//# sourceMappingURL=makeClassES5Compatible.js.map
