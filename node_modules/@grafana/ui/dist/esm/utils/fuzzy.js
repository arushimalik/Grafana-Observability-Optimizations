import { last } from 'lodash';

function fuzzyMatch(stack, needle) {
  let distance = 0, searchIndex = stack.indexOf(needle);
  needle = needle.replace(/\s/g, "");
  const ranges = [];
  if (searchIndex !== -1) {
    return {
      distance: 0,
      found: true,
      ranges: [{ start: searchIndex, end: searchIndex + needle.length - 1 }]
    };
  }
  for (const letter of needle) {
    const letterIndex = stack.indexOf(letter, searchIndex);
    if (letterIndex === -1) {
      return { distance: Infinity, ranges: [], found: false };
    }
    if (searchIndex !== -1) {
      distance += letterIndex - searchIndex;
    }
    searchIndex = letterIndex + 1;
    if (ranges.length === 0) {
      ranges.push({ start: letterIndex, end: letterIndex });
    } else {
      const lastRange = last(ranges);
      if (letterIndex === lastRange.end + 1) {
        lastRange.end++;
      } else {
        ranges.push({ start: letterIndex, end: letterIndex });
      }
    }
  }
  return {
    distance,
    ranges,
    found: true
  };
}

export { fuzzyMatch };
//# sourceMappingURL=fuzzy.js.map
