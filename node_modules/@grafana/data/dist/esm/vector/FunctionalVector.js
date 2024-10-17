var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var _a;
class FunctionalVector {
  constructor() {
    // Object not implemented
    __publicField(this, _a, {});
  }
  // Implement "iterator protocol"
  *iterator() {
    for (let i = 0; i < this.length; i++) {
      yield this.get(i);
    }
  }
  set(index, value) {
    throw "unsupported operation";
  }
  add(value) {
    throw "unsupported operation";
  }
  push(...vals) {
    for (const v of vals) {
      this.add(v);
    }
    return this.length;
  }
  // Implement "iterable protocol"
  [Symbol.iterator]() {
    return this.iterator();
  }
  forEach(iterator) {
    return vectorator(this).forEach(iterator);
  }
  map(transform) {
    return vectorator(this).map(transform);
  }
  filter(predicate) {
    return vectorator(this).filter(predicate);
  }
  at(index) {
    return this.get(index);
  }
  toArray() {
    const arr = new Array(this.length);
    for (let i = 0; i < this.length; i++) {
      arr[i] = this.get(i);
    }
    return arr;
  }
  join(separator) {
    return this.toArray().join(separator);
  }
  toJSON() {
    return this.toArray();
  }
  pop() {
    throw new Error("Method not implemented.");
  }
  concat(...items) {
    throw new Error("Method not implemented.");
  }
  reverse() {
    throw new Error("Method not implemented.");
  }
  shift() {
    throw new Error("Method not implemented.");
  }
  sort(compareFn) {
    throw new Error("Method not implemented.");
  }
  splice(start, deleteCount, ...items) {
    throw new Error("Method not implemented.");
  }
  unshift(...items) {
    throw new Error("Method not implemented.");
  }
  fill(value, start, end) {
    throw new Error("Method not implemented.");
  }
  copyWithin(target, start, end) {
    throw new Error("Method not implemented.");
  }
  //--------------------------------------------------------------------------------
  // Delegated Array function -- these will not be efficient :grimmice:
  //--------------------------------------------------------------------------------
  slice(start, end) {
    return this.toArray().slice(start, end);
  }
  indexOf(searchElement, fromIndex) {
    return this.toArray().indexOf(searchElement, fromIndex);
  }
  lastIndexOf(searchElement, fromIndex) {
    return this.toArray().lastIndexOf(searchElement, fromIndex);
  }
  every(predicate, thisArg) {
    return this.toArray().every(predicate, thisArg);
  }
  some(predicate, thisArg) {
    return this.toArray().some(predicate, thisArg);
  }
  reduce(callbackfn, initialValue) {
    throw new Error("Method not implemented.");
  }
  reduceRight(callbackfn, initialValue) {
    throw new Error("Method not implemented.");
  }
  find(predicate, thisArg) {
    return this.toArray().find(predicate, thisArg);
  }
  findIndex(predicate, thisArg) {
    return this.toArray().findIndex(predicate, thisArg);
  }
  entries() {
    return this.toArray().entries();
  }
  keys() {
    return this.toArray().keys();
  }
  values() {
    return this.toArray().values();
  }
  includes(searchElement, fromIndex) {
    return this.toArray().includes(searchElement, fromIndex);
  }
  flatMap(callback, thisArg) {
    return this.toArray().flatMap(callback, thisArg);
  }
  flat(depth) {
    throw new Error("Method not implemented.");
  }
}
_a = Symbol.unscopables;
const emptyarray = [];
function vectorator(vector) {
  return {
    *[Symbol.iterator]() {
      for (let i = 0; i < vector.length; i++) {
        yield vector.get(i);
      }
    },
    forEach(iterator) {
      for (let i = 0; i < vector.length; i++) {
        iterator(vector.get(i), i, emptyarray);
      }
    },
    map(transform) {
      const result = [];
      for (let i = 0; i < vector.length; i++) {
        result.push(transform(vector.get(i), i, emptyarray));
      }
      return result;
    },
    /** Add a predicate where you return true if it should *keep* the value */
    filter(predicate) {
      const result = [];
      let count = 0;
      for (const val of this) {
        if (predicate(val, count++, emptyarray)) {
          result.push(val);
        }
      }
      return result;
    }
  };
}

export { FunctionalVector, vectorator };
//# sourceMappingURL=FunctionalVector.js.map
