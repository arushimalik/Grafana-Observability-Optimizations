import { css } from '@emotion/react';

function getExtraStyles(theme) {
  return css({
    // fix white background on intercom in dark mode
    "iframe.intercom-borderless-frame": {
      colorScheme: theme.colors.mode
    }
  });
}

export { getExtraStyles };
//# sourceMappingURL=extra.js.map
