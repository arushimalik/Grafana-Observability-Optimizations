const onChangeCascader = (onChanged) => (values, options) => {
  if (onChanged) {
    onChanged(
      values.map((value) => String(value)),
      fromRCOptions(options)
    );
  }
};
const onLoadDataCascader = (onLoadData) => (options) => {
  if (onLoadData) {
    onLoadData(fromRCOptions(options));
  }
};
const fromRCOptions = (options) => {
  return options.map(fromRCOption);
};
const fromRCOption = (option) => {
  const value = option.value ? String(option.value) : "";
  return {
    value,
    label: typeof option.label === "string" ? option.label : value
  };
};

export { onChangeCascader, onLoadDataCascader };
//# sourceMappingURL=optionMappings.js.map
