const createDimension = (name, columns) => {
  return {
    name,
    columns
  };
};
const getColumnsFromDimension = (dimension) => {
  return dimension.columns;
};
const getColumnFromDimension = (dimension, column) => {
  return dimension.columns[column];
};
const getValueFromDimension = (dimension, column, row) => {
  return dimension.columns[column].values[row];
};
const getAllValuesFromDimension = (dimension, column, row) => {
  return dimension.columns.map((c) => c.values[row]);
};
const getDimensionByName = (dimensions, name) => dimensions[name];

export { createDimension, getAllValuesFromDimension, getColumnFromDimension, getColumnsFromDimension, getDimensionByName, getValueFromDimension };
//# sourceMappingURL=dimensions.js.map
