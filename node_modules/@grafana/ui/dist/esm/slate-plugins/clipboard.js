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
const getCopiedText = (textBlocks, startOffset, endOffset) => {
  if (!textBlocks.length) {
    return void 0;
  }
  const excludingLastLineLength = textBlocks.slice(0, -1).join("").length + textBlocks.length - 1;
  return textBlocks.join("\n").slice(startOffset, excludingLastLineLength + endOffset);
};
const removeBom = (str) => {
  return str == null ? void 0 : str.replace(/[\uFEFF]/g, "");
};
function ClipboardPlugin() {
  const clipboardPlugin = {
    onCopy(event, editor, next) {
      event.preventDefault();
      const { document, selection } = editor.value;
      const {
        start: { offset: startOffset },
        end: { offset: endOffset }
      } = selection;
      const selectedBlocks = document.getLeafBlocksAtRange(selection).toArray().map((block) => block.text);
      const copiedText = removeBom(getCopiedText(selectedBlocks, startOffset, endOffset));
      if (copiedText && event.clipboardData) {
        event.clipboardData.setData("Text", copiedText);
      }
      return true;
    },
    onPaste(event, editor, next) {
      event.preventDefault();
      if (event.clipboardData) {
        const pastedValue = removeBom(event.clipboardData.getData("Text"));
        const lines = pastedValue == null ? void 0 : pastedValue.split("\n");
        if (lines && lines.length) {
          editor.insertText(lines[0]);
          for (const line of lines.slice(1)) {
            editor.splitBlock().insertText(line);
          }
        }
      }
      return true;
    }
  };
  return __spreadProps(__spreadValues({}, clipboardPlugin), {
    onCut(event, editor, next) {
      clipboardPlugin.onCopy(event, editor, next);
      editor.deleteAtRange(editor.value.selection);
      return true;
    }
  });
}

export { ClipboardPlugin };
//# sourceMappingURL=clipboard.js.map
