import { Block, Text, Document, Value } from 'slate';

const SCHEMA = {
  document: {
    nodes: [
      {
        match: [{ type: "paragraph" }, { type: "code_block" }, { type: "code_line" }]
      }
    ]
  },
  inlines: {}
};
const makeFragment = (text, syntax) => {
  const lines = text.split("\n").map(
    (line) => Block.create({
      type: "code_line",
      nodes: [Text.create(line)]
    })
  );
  const block = Block.create({
    data: {
      syntax
    },
    type: "code_block",
    nodes: lines
  });
  return Document.create({
    nodes: [block]
  });
};
const makeValue = (text, syntax) => {
  const fragment = makeFragment(text, syntax);
  return Value.create({
    document: fragment
  });
};

export { SCHEMA, makeFragment, makeValue };
//# sourceMappingURL=slate.js.map
