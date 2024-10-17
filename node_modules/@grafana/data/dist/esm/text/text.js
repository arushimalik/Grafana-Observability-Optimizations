function findHighlightChunksInText({
  searchWords,
  textToHighlight
}) {
  const chunks = [];
  for (const term of searchWords) {
    if (typeof term === "string") {
      chunks.push(...findMatchesInText(textToHighlight, term));
    }
  }
  return chunks;
}
const cleanNeedle = (needle) => {
  return needle.replace(/[[{(][\w,.\/:;<=>?:*+]+$/, "");
};
function findMatchesInText(haystack, needle) {
  if (!haystack || !needle) {
    return [];
  }
  const matches = [];
  const { cleaned, flags } = parseFlags(cleanNeedle(needle));
  let regexp;
  try {
    regexp = new RegExp(`(?:${cleaned})`, flags);
  } catch (error) {
    return matches;
  }
  haystack.replace(regexp, (substring, ...rest) => {
    if (substring) {
      const offset = rest[rest.length - 2];
      matches.push({
        text: substring,
        start: offset,
        length: substring.length,
        end: offset + substring.length
      });
    }
    return "";
  });
  return matches;
}
const CLEAR_FLAG = "-";
const FLAGS_REGEXP = /\(\?([ims-]+)\)/g;
function parseFlags(text) {
  const flags = /* @__PURE__ */ new Set(["g"]);
  const cleaned = text.replace(FLAGS_REGEXP, (str, group) => {
    const clearAll = group.startsWith(CLEAR_FLAG);
    for (let i = 0; i < group.length; ++i) {
      const flag = group.charAt(i);
      if (clearAll || group.charAt(i - 1) === CLEAR_FLAG) {
        flags.delete(flag);
      } else if (flag !== CLEAR_FLAG) {
        flags.add(flag);
      }
    }
    return "";
  });
  return {
    cleaned,
    flags: Array.from(flags).join("")
  };
}

export { findHighlightChunksInText, findMatchesInText, parseFlags };
//# sourceMappingURL=text.js.map
