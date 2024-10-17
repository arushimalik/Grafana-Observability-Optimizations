let _context;
const cache = /* @__PURE__ */ new Map();
const cacheLimit = 500;
let ctxFontStyle = "";
function getCanvasContext() {
  if (!_context) {
    _context = document.createElement("canvas").getContext("2d");
  }
  return _context;
}
function measureText(text, fontSize, fontWeight = 400) {
  const fontStyle = `${fontWeight} ${fontSize}px 'Inter'`;
  const cacheKey = text + fontStyle;
  const fromCache = cache.get(cacheKey);
  if (fromCache) {
    return fromCache;
  }
  const context = getCanvasContext();
  if (ctxFontStyle !== fontStyle) {
    context.font = ctxFontStyle = fontStyle;
  }
  const metrics = context.measureText(text);
  if (cache.size === cacheLimit) {
    cache.clear();
  }
  cache.set(cacheKey, metrics);
  return metrics;
}
function calculateFontSize(text, width, height, lineHeight, maxSize, fontWeight) {
  const textSize = measureText(text, 14, fontWeight);
  const fontSizeBasedOnWidth = width / (textSize.width + 2) * 14;
  const fontSizeBasedOnHeight = height / lineHeight;
  const optimalSize = Math.min(fontSizeBasedOnHeight, fontSizeBasedOnWidth);
  return Math.min(optimalSize, maxSize != null ? maxSize : optimalSize);
}

export { calculateFontSize, getCanvasContext, measureText };
//# sourceMappingURL=measureText.js.map
