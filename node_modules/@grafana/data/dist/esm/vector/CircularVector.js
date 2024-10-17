import { FunctionalVector } from './FunctionalVector.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class CircularVector extends FunctionalVector {
  constructor(options) {
    super();
    __publicField(this, "buffer");
    __publicField(this, "index");
    __publicField(this, "capacity");
    __publicField(this, "tail");
    this.buffer = options.buffer || [];
    this.capacity = this.buffer.length;
    this.tail = "head" !== options.append;
    this.index = 0;
    this.add = this.getAddFunction();
    if (options.capacity) {
      this.setCapacity(options.capacity);
    }
    return new Proxy(this, {
      get(target, property, receiver) {
        if (typeof property !== "symbol") {
          const idx = +property;
          if (String(idx) === property) {
            return target.get(idx);
          }
        }
        return Reflect.get(target, property, receiver);
      },
      set(target, property, value, receiver) {
        if (typeof property !== "symbol") {
          const idx = +property;
          if (String(idx) === property) {
            target.set(idx, value);
            return true;
          }
        }
        return Reflect.set(target, property, value, receiver);
      }
    });
  }
  /**
   * This gets the appropriate add function depending on the buffer state:
   *  * head vs tail
   *  * growing buffer vs overwriting values
   */
  getAddFunction() {
    if (this.capacity > this.buffer.length) {
      if (this.tail) {
        return (value) => {
          this.buffer.push(value);
          if (this.buffer.length >= this.capacity) {
            this.add = this.getAddFunction();
          }
        };
      } else {
        return (value) => {
          this.buffer.unshift(value);
          if (this.buffer.length >= this.capacity) {
            this.add = this.getAddFunction();
          }
        };
      }
    }
    if (this.tail) {
      return (value) => {
        this.buffer[this.index] = value;
        this.index = (this.index + 1) % this.buffer.length;
      };
    }
    return (value) => {
      let idx = this.index - 1;
      if (idx < 0) {
        idx = this.buffer.length - 1;
      }
      this.buffer[idx] = value;
      this.index = idx;
    };
  }
  setCapacity(v) {
    if (this.capacity === v) {
      return;
    }
    const copy = this.toArray();
    if (v > this.length) {
      this.buffer = copy;
    } else if (v < this.capacity) {
      const delta = this.length - v;
      if (this.tail) {
        this.buffer = copy.slice(delta, copy.length);
      } else {
        this.buffer = copy.slice(0, copy.length - delta);
      }
    }
    this.capacity = v;
    this.index = 0;
    this.add = this.getAddFunction();
  }
  setAppendMode(mode) {
    const tail = "head" !== mode;
    if (tail !== this.tail) {
      this.buffer = this.toArray().reverse();
      this.index = 0;
      this.tail = tail;
      this.add = this.getAddFunction();
    }
  }
  reverse() {
    return this.buffer.reverse();
  }
  get(index) {
    return this.buffer[(index + this.index) % this.buffer.length];
  }
  set(index, value) {
    this.buffer[(index + this.index) % this.buffer.length] = value;
  }
  get length() {
    return this.buffer.length;
  }
}

export { CircularVector };
//# sourceMappingURL=CircularVector.js.map
