import { BusEventBase, BusEventWithPayload } from '@grafana/data';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class RefreshEvent extends BusEventBase {
}
__publicField(RefreshEvent, "type", "refresh");
class ThemeChangedEvent extends BusEventWithPayload {
}
__publicField(ThemeChangedEvent, "type", "theme-changed");
class TimeRangeUpdatedEvent extends BusEventWithPayload {
}
__publicField(TimeRangeUpdatedEvent, "type", "time-range-updated");
class CopyPanelEvent extends BusEventWithPayload {
}
__publicField(CopyPanelEvent, "type", "copy-panel");
let singletonInstance;
function setAppEvents(instance) {
  singletonInstance = instance;
}
function getAppEvents() {
  return singletonInstance;
}

export { CopyPanelEvent, RefreshEvent, ThemeChangedEvent, TimeRangeUpdatedEvent, getAppEvents, setAppEvents };
//# sourceMappingURL=appEvents.js.map
