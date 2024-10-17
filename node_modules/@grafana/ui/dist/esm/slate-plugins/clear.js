function ClearPlugin() {
  return {
    onKeyDown(event, editor, next) {
      const value = editor.value;
      if (value.selection.isExpanded) {
        return next();
      }
      if (event.key === "k" && event.ctrlKey) {
        event.preventDefault();
        const text = value.anchorText.text;
        const offset = value.selection.anchor.offset;
        const length = text.length;
        const forward = length - offset;
        editor.deleteForward(forward);
        return true;
      }
      return next();
    }
  };
}

export { ClearPlugin };
//# sourceMappingURL=clear.js.map
