const calculateGridDimensions = (parentWidth, parentHeight, itemSpacing, numberOfChildren) => {
  const vertical = calculateSizeOfChild(parentWidth, parentHeight, numberOfChildren);
  const horizontal = calculateSizeOfChild(parentHeight, parentWidth, numberOfChildren);
  const square = Math.max(vertical, horizontal);
  let xCount = Math.floor(parentWidth / square);
  let yCount = Math.ceil(numberOfChildren / xCount);
  xCount = Math.ceil(numberOfChildren / yCount);
  const itemsOnLastRow = xCount - (xCount * yCount - numberOfChildren);
  const widthOnLastRow = parentWidth / itemsOnLastRow - itemSpacing + itemSpacing / itemsOnLastRow;
  return {
    width: parentWidth / xCount - itemSpacing + itemSpacing / xCount,
    height: parentHeight / yCount - itemSpacing + itemSpacing / yCount,
    widthOnLastRow,
    xCount,
    yCount
  };
};
function calculateSizeOfChild(parentWidth, parentHeight, numberOfChildren) {
  const parts = Math.ceil(Math.sqrt(numberOfChildren * parentWidth / parentHeight));
  if (Math.floor(parts * parentHeight / parentWidth) * parts < numberOfChildren) {
    return parentHeight / Math.ceil(parts * parentHeight / parentWidth);
  }
  return parentWidth / parts;
}

export { calculateGridDimensions };
//# sourceMappingURL=squares.js.map
