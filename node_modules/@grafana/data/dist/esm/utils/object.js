const objRemoveUndefined = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== void 0) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};
const isEmptyObject = (value) => {
  return typeof value === "object" && value !== null && Object.keys(value).length === 0;
};

export { isEmptyObject, objRemoveUndefined };
//# sourceMappingURL=object.js.map
