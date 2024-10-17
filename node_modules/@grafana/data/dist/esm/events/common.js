import { BusEventWithPayload, BusEventBase } from './types.js';

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
class DataHoverEvent extends BusEventWithPayload {
}
__publicField(DataHoverEvent, "type", "data-hover");
class DataHoverClearEvent extends BusEventBase {
}
__publicField(DataHoverClearEvent, "type", "data-hover-clear");
class DataSelectEvent extends BusEventWithPayload {
}
__publicField(DataSelectEvent, "type", "data-select");
class AnnotationChangeEvent extends BusEventWithPayload {
}
__publicField(AnnotationChangeEvent, "type", "annotation-event");
class DashboardLoadedEvent extends BusEventWithPayload {
}
__publicField(DashboardLoadedEvent, "type", "dashboard-loaded");
class DataSourceUpdatedSuccessfully extends BusEventBase {
}
__publicField(DataSourceUpdatedSuccessfully, "type", "datasource-updated-successfully");
class DataSourceTestSucceeded extends BusEventBase {
}
__publicField(DataSourceTestSucceeded, "type", "datasource-test-succeeded");
class DataSourceTestFailed extends BusEventBase {
}
__publicField(DataSourceTestFailed, "type", "datasource-test-failed");
class SetPanelAttentionEvent extends BusEventWithPayload {
}
__publicField(SetPanelAttentionEvent, "type", "set-panel-attention");

export { AnnotationChangeEvent, DashboardLoadedEvent, DataHoverClearEvent, DataHoverEvent, DataSelectEvent, DataSourceTestFailed, DataSourceTestSucceeded, DataSourceUpdatedSuccessfully, SetPanelAttentionEvent };
//# sourceMappingURL=common.js.map
