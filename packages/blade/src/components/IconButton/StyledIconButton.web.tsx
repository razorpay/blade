import styled from 'styled-components';

type StyledClickableProps = {
  contrast: 'low' | 'high';
};

const StyledClickable = styled.button<StyledClickableProps>((props) => {
  const { theme, contrast } = props;
  const linkColorToken = theme.colors.feedback.neutral.action.icon.link; // todo: should be from surfaceAction
  const contrastToken = contrast === 'high' ? 'highContrast' : 'lowContrast';
  const motionToken = theme.motion;

  return {
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    borderRadius: theme.border.radius.small,
    background: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: linkColorToken.default[contrastToken],
    transition: `all ${motionToken.duration.xquick} ${motionToken.easing.standard.effective}`,

    'svg, path': {
      // todo: should be ideally set in Icon component
      fill: 'currentColor',
    },

    '&:hover': {
      color: linkColorToken.hover[contrastToken],
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      color: linkColorToken.focus[contrastToken],
    },

    '&:active': {
      color: linkColorToken.active[contrastToken],
    },
  };
});

export default StyledClickable;
