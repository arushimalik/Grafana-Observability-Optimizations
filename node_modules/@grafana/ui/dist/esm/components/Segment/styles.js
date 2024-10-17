import { css } from '@emotion/css';

const getSegmentStyles = (theme) => {
  const palette = "v1" in theme ? theme.v1.palette : theme.palette;
  return {
    segment: css({
      cursor: "pointer",
      width: "auto"
    }),
    queryPlaceholder: css({
      color: palette.gray2
    }),
    disabled: css({
      cursor: "not-allowed",
      opacity: 0.65,
      boxShadow: "none"
    })
  };
};

export { getSegmentStyles };
//# sourceMappingURL=styles.js.map
