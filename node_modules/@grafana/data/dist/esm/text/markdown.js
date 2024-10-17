import { marked } from 'marked';
import { mangle } from 'marked-mangle';
import { sanitizeTextPanelContent } from './sanitize.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
let hasInitialized = false;
const markdownOptions = {
  pedantic: false,
  gfm: true,
  breaks: false
};
function renderMarkdown(str, options) {
  if (!hasInitialized) {
    marked.use(mangle());
    marked.setOptions(__spreadValues({}, markdownOptions));
    hasInitialized = true;
  }
  let opts = void 0;
  if (options == null ? void 0 : options.breaks) {
    opts = __spreadProps(__spreadValues({}, markdownOptions), {
      breaks: true
    });
  }
  const html = marked(str || "", opts);
  if (typeof html !== "string") {
    throw new Error("Failed to process markdown synchronously.");
  }
  if (options == null ? void 0 : options.noSanitize) {
    return html;
  }
  return sanitizeTextPanelContent(html);
}
function renderTextPanelMarkdown(str, options) {
  if (!hasInitialized) {
    marked.use(mangle());
    marked.setOptions(__spreadValues({}, markdownOptions));
    hasInitialized = true;
  }
  const html = marked(str || "");
  if (typeof html !== "string") {
    throw new Error("Failed to process markdown synchronously.");
  }
  if (options == null ? void 0 : options.noSanitize) {
    return html;
  }
  return sanitizeTextPanelContent(html);
}

export { renderMarkdown, renderTextPanelMarkdown };
//# sourceMappingURL=markdown.js.map
