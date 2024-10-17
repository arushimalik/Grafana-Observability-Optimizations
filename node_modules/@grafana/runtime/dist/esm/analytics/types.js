var MetaAnalyticsEventName = /* @__PURE__ */ ((MetaAnalyticsEventName2) => {
  MetaAnalyticsEventName2["DashboardView"] = "dashboard-view";
  MetaAnalyticsEventName2["DataRequest"] = "data-request";
  return MetaAnalyticsEventName2;
})(MetaAnalyticsEventName || {});
const isPageviewEvent = (event) => {
  return Boolean(event.payload.page);
};
const isInteractionEvent = (event) => {
  return Boolean(event.payload.interactionName);
};
const isExperimentViewEvent = (event) => {
  return Boolean(event.payload.experimentId);
};

export { MetaAnalyticsEventName, isExperimentViewEvent, isInteractionEvent, isPageviewEvent };
//# sourceMappingURL=types.js.map
