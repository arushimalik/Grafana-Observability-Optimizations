let rtpHook = void 0;
const setReturnToPreviousHook = (hook) => {
  rtpHook = hook;
};
const useReturnToPrevious = () => {
  if (!rtpHook) {
    if (process.env.NODE_ENV !== "production") {
      throw new Error("useReturnToPrevious hook not found in @grafana/runtime");
    }
    return () => console.error("ReturnToPrevious hook not found");
  }
  return rtpHook();
};

export { setReturnToPreviousHook, useReturnToPrevious };
//# sourceMappingURL=returnToPrevious.js.map
