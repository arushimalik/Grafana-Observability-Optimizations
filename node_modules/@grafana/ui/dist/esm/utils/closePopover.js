const closePopover = (event, hidePopper) => {
  if (event.key === "Tab" || event.altKey || event.ctrlKey || event.metaKey) {
    return;
  }
  event.stopPropagation();
  if (event.key === "Escape") {
    hidePopper();
  }
  return;
};

export { closePopover };
//# sourceMappingURL=closePopover.js.map
