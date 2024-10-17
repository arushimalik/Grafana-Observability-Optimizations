const typeList = /* @__PURE__ */ new Set();
function eventFactory(name) {
  if (typeList.has(name)) {
    throw new Error(`There is already an event defined with type '${name}'`);
  }
  typeList.add(name);
  return { name };
}

export { eventFactory };
//# sourceMappingURL=eventFactory.js.map
