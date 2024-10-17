function addTextSizeOptions(builder, withTitle = true) {
  if (withTitle) {
    builder.addNumberInput({
      path: "text.titleSize",
      category: ["Text size"],
      name: "Title",
      settings: {
        placeholder: "Auto",
        integer: false,
        min: 1,
        max: 200
      },
      defaultValue: void 0
    });
  }
  builder.addNumberInput({
    path: "text.valueSize",
    category: ["Text size"],
    name: "Value",
    settings: {
      placeholder: "Auto",
      integer: false,
      min: 1,
      max: 200
    },
    defaultValue: void 0
  });
}

export { addTextSizeOptions };
//# sourceMappingURL=text.js.map
