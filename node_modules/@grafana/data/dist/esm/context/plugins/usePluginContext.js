import { useContext } from 'react';
import { Context } from './PluginContext.js';

function usePluginContext() {
  const context = useContext(Context);
  if (!context) {
    throw new Error("usePluginContext must be used within a PluginContextProvider");
  }
  return context;
}

export { usePluginContext };
//# sourceMappingURL=usePluginContext.js.map
