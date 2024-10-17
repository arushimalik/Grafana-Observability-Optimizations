import { isKeyHotkey } from 'is-hotkey';
import { Range } from 'slate';
import Plain from 'slate-plain-serializer';

const isIndentLeftHotkey = isKeyHotkey("mod+[");
const isShiftTabHotkey = isKeyHotkey("shift+tab");
const isIndentRightHotkey = isKeyHotkey("mod+]");
const SLATE_TAB = "  ";
const handleTabKey = (event, editor, next) => {
  const {
    startBlock,
    endBlock,
    selection: {
      start: { offset: startOffset, key: startKey },
      end: { offset: endOffset, key: endKey }
    }
  } = editor.value;
  if (Plain.serialize(editor.value) === "") {
    return;
  }
  event.preventDefault();
  const first = startBlock.getFirstText();
  const startBlockIsSelected = first && startOffset === 0 && startKey === first.key && endOffset === first.text.length && endKey === first.key;
  if (startBlockIsSelected || !startBlock.equals(endBlock)) {
    handleIndent(editor, "right");
  } else {
    editor.insertText(SLATE_TAB);
  }
};
const handleIndent = (editor, indentDirection) => {
  const curSelection = editor.value.selection;
  const selectedBlocks = editor.value.document.getLeafBlocksAtRange(curSelection).toArray();
  if (indentDirection === "left") {
    for (const block of selectedBlocks) {
      const blockWhitespace = block.text.length - block.text.trimLeft().length;
      const textKey = block.getFirstText().key;
      const rangeProperties = {
        anchor: {
          key: textKey,
          offset: blockWhitespace,
          path: []
        },
        focus: {
          key: textKey,
          offset: blockWhitespace,
          path: []
        }
      };
      editor.deleteBackwardAtRange(Range.create(rangeProperties), Math.min(SLATE_TAB.length, blockWhitespace));
    }
  } else {
    const { startText } = editor.value;
    const textBeforeCaret = startText.text.slice(0, curSelection.start.offset);
    const isWhiteSpace = /^\s*$/.test(textBeforeCaret);
    for (const block of selectedBlocks) {
      editor.insertTextByKey(block.getFirstText().key, 0, SLATE_TAB);
    }
    if (isWhiteSpace) {
      editor.moveStartBackward(SLATE_TAB.length);
    }
  }
};
function IndentationPlugin() {
  return {
    onKeyDown(event, editor, next) {
      if (isIndentLeftHotkey(event) || isShiftTabHotkey(event)) {
        event.preventDefault();
        handleIndent(editor, "left");
      } else if (isIndentRightHotkey(event)) {
        event.preventDefault();
        handleIndent(editor, "right");
      } else if (event.key === "Tab") {
        handleTabKey(event, editor);
      } else {
        return next();
      }
      return true;
    }
  };
}

export { IndentationPlugin };
//# sourceMappingURL=indentation.js.map
