const isElementOverflowing = (element) => {
  if (!element) {
    return false;
  }
  const wrapperPos = element.parentElement.getBoundingClientRect();
  const pos = element.getBoundingClientRect();
  return pos.width !== 0 && wrapperPos.right + pos.width + 10 > window.innerWidth;
};

export { isElementOverflowing };
//# sourceMappingURL=utils.js.map
