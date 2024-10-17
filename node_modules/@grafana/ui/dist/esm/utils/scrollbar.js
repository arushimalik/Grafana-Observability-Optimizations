let scrollbarWidth = null;
function getScrollbarWidth() {
  if (scrollbarWidth !== null) {
    return scrollbarWidth;
  }
  if (typeof document !== "undefined") {
    const div = document.createElement("div");
    const newStyles = {
      width: "100px",
      height: "100px",
      position: "absolute",
      top: "-9999px",
      overflow: "scroll",
      MsOverflowStyle: "scrollbar"
    };
    Object.keys(newStyles).map((style) => {
      div.style[style] = newStyles[style];
    });
    document.body.appendChild(div);
    scrollbarWidth = div.offsetWidth - div.clientWidth;
    document.body.removeChild(div);
  } else {
    scrollbarWidth = 0;
  }
  return scrollbarWidth || 0;
}

export { getScrollbarWidth };
//# sourceMappingURL=scrollbar.js.map
