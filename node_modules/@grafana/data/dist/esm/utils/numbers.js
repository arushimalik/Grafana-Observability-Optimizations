function roundDecimals(val, dec = 0) {
  if (Number.isInteger(val)) {
    return val;
  }
  let p = 10 ** dec;
  let n = val * p * (1 + Number.EPSILON);
  return Math.round(n) / p;
}
function guessDecimals(num) {
  return (("" + num).split(".")[1] || "").length;
}

export { guessDecimals, roundDecimals };
//# sourceMappingURL=numbers.js.map
