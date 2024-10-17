var LiveChannelScope = /* @__PURE__ */ ((LiveChannelScope2) => {
  LiveChannelScope2["DataSource"] = "ds";
  LiveChannelScope2["Plugin"] = "plugin";
  LiveChannelScope2["Grafana"] = "grafana";
  LiveChannelScope2["Stream"] = "stream";
  return LiveChannelScope2;
})(LiveChannelScope || {});
var LiveChannelType = /* @__PURE__ */ ((LiveChannelType2) => {
  LiveChannelType2["DataStream"] = "stream";
  LiveChannelType2["DataFrame"] = "frame";
  LiveChannelType2["JSON"] = "json";
  return LiveChannelType2;
})(LiveChannelType || {});
var LiveChannelConnectionState = /* @__PURE__ */ ((LiveChannelConnectionState2) => {
  LiveChannelConnectionState2["Pending"] = "pending";
  LiveChannelConnectionState2["Connected"] = "connected";
  LiveChannelConnectionState2["Connecting"] = "connecting";
  LiveChannelConnectionState2["Disconnected"] = "disconnected";
  LiveChannelConnectionState2["Shutdown"] = "shutdown";
  LiveChannelConnectionState2["Invalid"] = "invalid";
  return LiveChannelConnectionState2;
})(LiveChannelConnectionState || {});
var LiveChannelEventType = /* @__PURE__ */ ((LiveChannelEventType2) => {
  LiveChannelEventType2["Status"] = "status";
  LiveChannelEventType2["Join"] = "join";
  LiveChannelEventType2["Leave"] = "leave";
  LiveChannelEventType2["Message"] = "message";
  return LiveChannelEventType2;
})(LiveChannelEventType || {});
function isLiveChannelStatusEvent(evt) {
  return evt.type === "status" /* Status */;
}
function isLiveChannelJoinEvent(evt) {
  return evt.type === "join" /* Join */;
}
function isLiveChannelLeaveEvent(evt) {
  return evt.type === "leave" /* Leave */;
}
function isLiveChannelMessageEvent(evt) {
  return evt.type === "message" /* Message */;
}
function parseLiveChannelAddress(id) {
  if (id == null ? void 0 : id.length) {
    let parts = id.trim().split("/");
    if (parts.length >= 3) {
      return {
        scope: parts[0],
        namespace: parts[1],
        path: parts.slice(2).join("/")
      };
    }
  }
  return void 0;
}
function isValidLiveChannelAddress(addr) {
  return !!((addr == null ? void 0 : addr.path) && addr.namespace && addr.scope);
}
function toLiveChannelId(addr) {
  if (!addr.scope) {
    return "";
  }
  let id = addr.scope;
  if (!addr.namespace) {
    return id;
  }
  id += "/" + addr.namespace;
  if (!addr.path) {
    return id;
  }
  return id + "/" + addr.path;
}

export { LiveChannelConnectionState, LiveChannelEventType, LiveChannelScope, LiveChannelType, isLiveChannelJoinEvent, isLiveChannelLeaveEvent, isLiveChannelMessageEvent, isLiveChannelStatusEvent, isValidLiveChannelAddress, parseLiveChannelAddress, toLiveChannelId };
//# sourceMappingURL=live.js.map
