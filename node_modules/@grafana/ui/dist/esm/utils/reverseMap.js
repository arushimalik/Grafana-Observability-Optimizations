function reverseMap(arr, callbackfn) {
  const reversedAndMapped = new Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    const reverseIndex = arr.length - 1 - i;
    reversedAndMapped[i] = callbackfn(arr[reverseIndex], reverseIndex, arr);
  }
  return reversedAndMapped;
}

export { reverseMap };
//# sourceMappingURL=reverseMap.js.map
