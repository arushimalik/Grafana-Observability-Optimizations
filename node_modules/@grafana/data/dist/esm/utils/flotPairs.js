import { NullValueMode } from '../types/data.js';

function getFlotPairs({ xField, yField, nullValueMode }) {
  const vX = xField.values;
  const vY = yField.values;
  const length = vX.length;
  if (vY.length !== length) {
    throw new Error("Unexpected field length");
  }
  const ignoreNulls = nullValueMode === NullValueMode.Ignore;
  const nullAsZero = nullValueMode === NullValueMode.AsZero;
  const pairs = [];
  for (let i = 0; i < length; i++) {
    const x = vX[i];
    let y = vY[i];
    if (y === null) {
      if (ignoreNulls) {
        continue;
      }
      if (nullAsZero) {
        y = 0;
      }
    }
    if (x === null) {
      continue;
    }
    pairs.push([x, y]);
  }
  return pairs;
}
function getFlotPairsConstant(seriesData, range) {
  if (!range.from || !range.to || !seriesData || seriesData.length === 0) {
    return [];
  }
  const from = range.from.valueOf();
  const to = range.to.valueOf();
  const value = seriesData[0][1];
  return [
    [from, value],
    [to, value]
  ];
}

export { getFlotPairs, getFlotPairsConstant };
//# sourceMappingURL=flotPairs.js.map
