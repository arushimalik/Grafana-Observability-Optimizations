const getSeriesTimeStep = (timeField) => {
  let previousTime;
  let returnTimeStep = Number.MAX_VALUE;
  for (let i = 0; i < timeField.values.length; i++) {
    const currentTime = timeField.values[i];
    if (previousTime !== void 0) {
      const timeStep = currentTime - previousTime;
      {
        returnTimeStep = timeStep;
      }
      if (timeStep < returnTimeStep) {
        returnTimeStep = timeStep;
      }
    }
    previousTime = currentTime;
  }
  return returnTimeStep;
};
const hasMsResolution = (timeField) => {
  for (let i = 0; i < timeField.values.length; i++) {
    const value = timeField.values[i];
    if (value !== null && value !== void 0) {
      const timestamp = value.toString();
      if (timestamp.length === 13 && timestamp % 1e3 !== 0) {
        return true;
      }
    }
  }
  return false;
};

export { getSeriesTimeStep, hasMsResolution };
//# sourceMappingURL=series.js.map
