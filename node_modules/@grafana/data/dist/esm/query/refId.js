const getNextRefId = (queries) => {
  for (let num = 0; ; num++) {
    const refId = getRefId(num);
    if (!queries.some((query) => query.refId === refId)) {
      return refId;
    }
  }
};
function getRefId(num) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (num < letters.length) {
    return letters[num];
  } else {
    return getRefId(Math.floor(num / letters.length) - 1) + letters[num % letters.length];
  }
}

export { getNextRefId };
//# sourceMappingURL=refId.js.map
