import { css } from '@emotion/css';
import { getResponsiveStyle } from './responsiveness.js';

const getSizeStyles = (theme, width, minWidth, maxWidth, height, minHeight, maxHeight) => {
  return css([
    getResponsiveStyle(theme, width, (val) => ({
      width: theme.spacing(val)
    })),
    getResponsiveStyle(theme, minWidth, (val) => ({
      minWidth: theme.spacing(val)
    })),
    getResponsiveStyle(theme, maxWidth, (val) => ({
      maxWidth: theme.spacing(val)
    })),
    getResponsiveStyle(theme, height, (val) => ({
      height: theme.spacing(val)
    })),
    getResponsiveStyle(theme, minHeight, (val) => ({
      minHeight: theme.spacing(val)
    })),
    getResponsiveStyle(theme, maxHeight, (val) => ({
      maxHeight: theme.spacing(val)
    }))
  ]);
};

export { getSizeStyles };
//# sourceMappingURL=styles.js.map
