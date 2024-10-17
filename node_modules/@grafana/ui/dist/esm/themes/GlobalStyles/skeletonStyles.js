import { css } from '@emotion/react';
import { skeletonAnimation } from '../../utils/skeleton.js';

const getSkeletonStyles = (theme) => {
  return css({
    ".react-loading-skeleton": skeletonAnimation
  });
};

export { getSkeletonStyles };
//# sourceMappingURL=skeletonStyles.js.map
