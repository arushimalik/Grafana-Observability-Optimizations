import { CodeEditorSuggestionItemKind } from './types.js';

var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
function findInsertIndex(line) {
  for (let i = line.length - 1; i > 0; i--) {
    const ch = line.charAt(i);
    if (ch === "$") {
      return {
        index: i,
        prefix: line.substring(i)
      };
    }
    if (ch === " " || ch === "	" || ch === '"' || ch === "'") {
      return {
        index: i + 1,
        prefix: line.substring(i + 1)
      };
    }
  }
  return {
    index: 0,
    prefix: line
  };
}
function getCompletionItems(monaco, prefix, suggestions, range) {
  var _a;
  const items = [];
  for (const suggestion of suggestions) {
    if (prefix && !suggestion.label.startsWith(prefix)) {
      continue;
    }
    items.push(__spreadProps(__spreadValues({}, suggestion), {
      kind: mapKinds(monaco, suggestion.kind),
      range,
      insertText: (_a = suggestion.insertText) != null ? _a : suggestion.label
    }));
  }
  return items;
}
function mapKinds(monaco, sug) {
  switch (sug) {
    case CodeEditorSuggestionItemKind.Method:
      return monaco.languages.CompletionItemKind.Method;
    case CodeEditorSuggestionItemKind.Field:
      return monaco.languages.CompletionItemKind.Field;
    case CodeEditorSuggestionItemKind.Property:
      return monaco.languages.CompletionItemKind.Property;
    case CodeEditorSuggestionItemKind.Constant:
      return monaco.languages.CompletionItemKind.Constant;
    case CodeEditorSuggestionItemKind.Text:
      return monaco.languages.CompletionItemKind.Text;
  }
  return monaco.languages.CompletionItemKind.Text;
}
function registerSuggestions(monaco, language, getSuggestions, modelId) {
  if (!language || !getSuggestions) {
    return void 0;
  }
  return monaco.languages.registerCompletionItemProvider(language, {
    triggerCharacters: ["$"],
    provideCompletionItems: (model, position, context) => {
      if (model.id !== modelId) {
        return void 0;
      }
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: position.column,
        endColumn: position.column
      };
      if (context.triggerCharacter === "$") {
        range.startColumn = position.column - 1;
        return {
          suggestions: getCompletionItems(monaco, "$", getSuggestions(), range)
        };
      }
      const currentLine = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      });
      const { index, prefix } = findInsertIndex(currentLine);
      range.startColumn = index + 1;
      const suggestions = getCompletionItems(monaco, prefix, getSuggestions(), range);
      if (suggestions.length) {
        return { suggestions };
      }
      return void 0;
    }
  });
}

export { findInsertIndex, registerSuggestions };
//# sourceMappingURL=suggestions.js.map
