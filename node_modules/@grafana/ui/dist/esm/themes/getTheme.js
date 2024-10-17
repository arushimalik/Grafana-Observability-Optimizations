import { createTheme } from '@grafana/data';

let themeMock;
const getTheme = (mode = "dark") => {
  if (themeMock) {
    return themeMock(mode);
  }
  return createTheme({ colors: { mode } }).v1;
};
const mockTheme = (mock) => {
  themeMock = mock;
  return () => {
    themeMock = null;
  };
};

export { getTheme, mockTheme };
//# sourceMappingURL=getTheme.js.map
