const history = {};
const deprecationWarning = (file, oldName, newName) => {
  let message = `[Deprecation warning] ${file}: ${oldName} is deprecated`;
  if (newName) {
    message += `. Use ${newName} instead`;
  }
  const now = Date.now();
  const last = history[message];
  if (!last || now - last > 1e4) {
    console.warn(message);
    history[message] = now;
  }
};

export { deprecationWarning };
//# sourceMappingURL=deprecationWarning.js.map
