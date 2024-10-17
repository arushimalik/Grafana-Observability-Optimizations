import { CodeEditorSuggestionItemKind } from './types.js';

function variableSuggestionToCodeEditorSuggestion(sug) {
  const label = "${" + sug.value + "}";
  const detail = sug.value === sug.label ? sug.origin : `${sug.label} / ${sug.origin}`;
  return {
    label,
    kind: CodeEditorSuggestionItemKind.Property,
    detail,
    documentation: sug.documentation
  };
}

export { variableSuggestionToCodeEditorSuggestion };
//# sourceMappingURL=utils.js.map
