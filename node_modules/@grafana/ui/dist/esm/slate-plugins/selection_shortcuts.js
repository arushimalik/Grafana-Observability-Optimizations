import { isKeyHotkey } from 'is-hotkey';

const isSelectLineHotkey = isKeyHotkey("mod+l");
function SelectionShortcutsPlugin() {
  return {
    onKeyDown(event, editor, next) {
      if (isSelectLineHotkey(event)) {
        event.preventDefault();
        const { focusBlock, document } = editor.value;
        editor.moveAnchorToStartOfBlock();
        const nextBlock = document.getNextBlock(focusBlock.key);
        if (nextBlock) {
          editor.moveFocusToStartOfNextBlock();
        } else {
          editor.moveFocusToEndOfText();
        }
      } else {
        return next();
      }
      return true;
    }
  };
}

export { SelectionShortcutsPlugin };
//# sourceMappingURL=selection_shortcuts.js.map
