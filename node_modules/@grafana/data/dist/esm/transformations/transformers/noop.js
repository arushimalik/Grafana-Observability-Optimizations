import { DataTransformerID } from './ids.js';

const noopTransformer = {
  id: DataTransformerID.noop,
  name: "noop",
  description: "No-operation transformer",
  defaultOptions: {},
  /** no operation */
  operator: (options) => (source) => source,
  /** no operation */
  transformer: (options) => (data) => data
};

export { noopTransformer };
//# sourceMappingURL=noop.js.map
