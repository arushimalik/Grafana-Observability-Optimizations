function RunnerPlugin({ handler }) {
  return {
    onKeyDown(event, editor, next) {
      if (handler && event.key === "Enter" && (event.shiftKey || event.ctrlKey)) {
        event.preventDefault();
        handler(event);
        return editor;
      }
      return next();
    }
  };
}

export { RunnerPlugin };
//# sourceMappingURL=runner.js.map
