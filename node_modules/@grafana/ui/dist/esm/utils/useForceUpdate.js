import { useState, useCallback } from 'react';

function useForceUpdate() {
  const [_, setValue] = useState(0);
  return useCallback(() => setValue((prevState) => prevState + 1), []);
}

export { useForceUpdate };
//# sourceMappingURL=useForceUpdate.js.map
