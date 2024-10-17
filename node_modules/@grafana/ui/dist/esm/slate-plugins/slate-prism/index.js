import Prism from 'prismjs';
import { Block } from 'slate';
import TOKEN_MARK from './TOKEN_MARK.js';
import Options from './options.js';

function SlatePrism(optsParam = {}, prismLanguages = Prism.languages) {
  const opts = new Options(optsParam);
  return {
    decorateNode: (node, editor, next) => {
      if (!opts.onlyIn(node)) {
        return next();
      }
      const block = Block.create(node);
      const grammarName = opts.getSyntax(block);
      const grammar = prismLanguages[grammarName];
      if (!grammar) {
        return [];
      }
      const texts = block.getTexts();
      const blockText = texts.map((text) => text && text.getText()).join("\n");
      const tokens = Prism.tokenize(blockText, grammar);
      const flattened = flattenTokens(tokens);
      const newData = editor.value.data.set("tokens", flattened);
      editor.setData(newData);
      return decorateNode(opts, tokens, block);
    },
    renderDecoration: (props, editor, next) => opts.renderDecoration(
      {
        children: props.children,
        decoration: props.decoration
      },
      editor,
      next
    )
  };
}
function decorateNode(opts, tokens, block) {
  const texts = block.getTexts();
  const decorations = [];
  let textStart = 0;
  let textEnd = 0;
  texts.forEach((text) => {
    textEnd = textStart + text.getText().length;
    let offset = 0;
    function processToken(token, accu) {
      if (typeof token === "string") {
        if (accu) {
          const decoration = createDecoration({
            text,
            textStart,
            textEnd,
            start: offset,
            end: offset + token.length,
            className: `prism-token token ${accu}`,
            block
          });
          if (decoration) {
            decorations.push(decoration);
          }
        }
        offset += token.length;
      } else {
        accu = `${accu} ${token.type}`;
        if (token.alias) {
          accu += " " + token.alias;
        }
        if (typeof token.content === "string") {
          const decoration = createDecoration({
            text,
            textStart,
            textEnd,
            start: offset,
            end: offset + token.content.length,
            className: `prism-token token ${accu}`,
            block
          });
          if (decoration) {
            decorations.push(decoration);
          }
          offset += token.content.length;
        } else {
          for (let i = 0; i < token.content.length; i += 1) {
            processToken(token.content[i], accu);
          }
        }
      }
    }
    tokens.forEach(processToken);
    textStart = textEnd + 1;
  });
  return decorations;
}
function createDecoration({
  text,
  textStart,
  textEnd,
  start,
  end,
  className,
  block
}) {
  if (start >= textEnd || end <= textStart) {
    return null;
  }
  start = Math.max(start, textStart);
  end = Math.min(end, textEnd);
  start -= textStart;
  end -= textStart;
  const myDec = block.createDecoration({
    object: "decoration",
    anchor: {
      key: text.key,
      offset: start,
      object: "point"
    },
    focus: {
      key: text.key,
      offset: end,
      object: "point"
    },
    type: TOKEN_MARK,
    data: { className }
  });
  return myDec;
}
function flattenToken(token) {
  if (typeof token === "string") {
    return [
      {
        content: token,
        types: [],
        aliases: []
      }
    ];
  } else if (Array.isArray(token)) {
    return token.flatMap((t) => flattenToken(t));
  } else if (token instanceof Prism.Token) {
    return flattenToken(token.content).flatMap((t) => {
      var _a;
      let aliases = [];
      if (typeof token.alias === "string") {
        aliases = [token.alias];
      } else {
        aliases = (_a = token.alias) != null ? _a : [];
      }
      return {
        content: t.content,
        types: [token.type, ...t.types],
        aliases: [...aliases, ...t.aliases]
      };
    });
  }
  return [];
}
function flattenTokens(token) {
  const tokens = flattenToken(token);
  if (!tokens.length) {
    return [];
  }
  const firstToken = tokens[0];
  firstToken.prev = null;
  firstToken.next = tokens.length >= 2 ? tokens[1] : null;
  firstToken.offsets = {
    start: 0,
    end: firstToken.content.length
  };
  for (let i = 1; i < tokens.length - 1; i++) {
    tokens[i].prev = tokens[i - 1];
    tokens[i].next = tokens[i + 1];
    tokens[i].offsets = {
      start: tokens[i - 1].offsets.end,
      end: tokens[i - 1].offsets.end + tokens[i].content.length
    };
  }
  const lastToken = tokens[tokens.length - 1];
  lastToken.prev = tokens.length >= 2 ? tokens[tokens.length - 2] : null;
  lastToken.next = null;
  lastToken.offsets = {
    start: tokens.length >= 2 ? tokens[tokens.length - 2].offsets.end : 0,
    end: tokens.length >= 2 ? tokens[tokens.length - 2].offsets.end + lastToken.content.length : lastToken.content.length
  };
  return tokens;
}

export { SlatePrism, flattenTokens };
//# sourceMappingURL=index.js.map
