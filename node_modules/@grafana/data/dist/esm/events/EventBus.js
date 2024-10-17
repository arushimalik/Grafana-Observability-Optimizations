import EventEmitter from 'eventemitter3';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class EventBusSrv {
  constructor() {
    __publicField(this, "emitter");
    __publicField(this, "subscribers", /* @__PURE__ */ new Map());
    this.emitter = new EventEmitter();
  }
  publish(event) {
    this.emitter.emit(event.type, event);
  }
  subscribe(typeFilter, handler) {
    return this.getStream(typeFilter).subscribe({ next: handler });
  }
  getStream(eventType) {
    return new Observable((observer) => {
      const handler = (event) => {
        observer.next(event);
      };
      this.emitter.on(eventType.type, handler);
      this.subscribers.set(handler, observer);
      return () => {
        this.emitter.off(eventType.type, handler);
        this.subscribers.delete(handler);
      };
    });
  }
  newScopedBus(key, filter2) {
    return new ScopedEventBus([key], this, filter2);
  }
  /**
   * Legacy functions
   */
  emit(event, payload) {
    if (typeof event === "string") {
      this.emitter.emit(event, { type: event, payload });
    } else {
      this.emitter.emit(event.name, { type: event.name, payload });
    }
  }
  on(event, handler, scope) {
    handler.wrapper = (emittedEvent) => {
      handler(emittedEvent.payload);
    };
    if (typeof event === "string") {
      this.emitter.on(event, handler.wrapper);
    } else {
      this.emitter.on(event.name, handler.wrapper);
    }
    if (scope) {
      const unbind = scope.$on("$destroy", () => {
        this.off(event, handler);
        unbind();
      });
    }
  }
  off(event, handler) {
    if (typeof event === "string") {
      this.emitter.off(event, handler.wrapper);
      return;
    }
    this.emitter.off(event.name, handler.wrapper);
  }
  removeAllListeners() {
    this.emitter.removeAllListeners();
    for (const [key, sub] of this.subscribers) {
      sub.complete();
      this.subscribers.delete(key);
    }
  }
}
class ScopedEventBus {
  // The path is not yet exposed, but can be used to indicate nested groups and support faster filtering
  constructor(path, eventBus, filter2) {
    this.path = path;
    this.eventBus = eventBus;
    // will be mutated by panel runners
    __publicField(this, "filterConfig");
    this.filterConfig = filter2 != null ? filter2 : { onlyLocal: false };
  }
  publish(event) {
    if (!event.origin) {
      event.origin = this;
    }
    this.eventBus.publish(event);
  }
  filter(event) {
    if (this.filterConfig.onlyLocal) {
      return event.origin === this;
    }
    return true;
  }
  getStream(eventType) {
    return this.eventBus.getStream(eventType).pipe(filter(this.filter.bind(this)));
  }
  // syntax sugar
  subscribe(typeFilter, handler) {
    return this.getStream(typeFilter).subscribe({ next: handler });
  }
  removeAllListeners() {
    this.eventBus.removeAllListeners();
  }
  /**
   * Creates a nested event bus structure
   */
  newScopedBus(key, filter2) {
    return new ScopedEventBus([...this.path, key], this, filter2);
  }
}

export { EventBusSrv };
//# sourceMappingURL=EventBus.js.map
