import styled from 'styled-components';

import type { ReactElement } from 'react';
import type { StyledIconButtonProps } from './StyledIconButton.d';
import { makeAccessible, makeMotionTime } from '~utils';
import type { ColorContrastTypes } from '~tokens/theme/theme';

type StyledButtonProps = {
  contrast: ColorContrastTypes;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StyledButton = styled.button<StyledButtonProps>((props: any) => {
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
    transitionProperty: 'color, box-shadow',
    transitionDuration: makeMotionTime(motionToken.duration.xquick),
    transitionTimingFunction: motionToken.easing.standard.effective as string,

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

const StyledIconButton = ({
  icon: Icon,
  onClick,
  size,
  contrast,
  accessibilityLabel,
}: StyledIconButtonProps): ReactElement => (
  <StyledButton
    onClick={onClick}
    contrast={contrast}
    {...makeAccessible({ label: accessibilityLabel })}
  >
    <Icon size={size} color="currentColor" />
  </StyledButton>
);

export default StyledIconButton;
