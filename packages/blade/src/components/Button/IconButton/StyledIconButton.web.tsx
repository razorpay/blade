/* eslint-disable react/display-name */
import styled from 'styled-components';
import type { ReactElement } from 'react';
import React from 'react';
import type { StyledIconButtonProps } from './types';
import { castWebType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { ColorContrastTypes } from '~tokens/theme/theme';
import { makeAccessible } from '~utils/makeAccessible';
import { makeMotionTime } from '~utils/makeMotionTime';

type StyledButtonProps = {
  contrast: ColorContrastTypes;
};

const StyledButton = styled.button<StyledButtonProps>((props) => {
  const { theme, contrast } = props;
  const iconColorToken = theme.colors.surface.action.icon;
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
    color: iconColorToken.default[contrastToken],
    transitionProperty: 'color, box-shadow',
    transitionDuration: castWebType(makeMotionTime(motionToken.duration.xquick)),
    transitionTimingFunction: motionToken.easing.standard.effective as string,

    '&:hover': {
      color: iconColorToken.hover[contrastToken],
    },

    '&:focus': {
      outline: 'none',
      boxShadow: `0px 0px 0px 4px ${theme.colors.brand.primary[400]}`,
      color: iconColorToken.focus[contrastToken],
    },

    '&:active': {
      color: iconColorToken.active[contrastToken],
    },
  };
});

const StyledIconButton = React.forwardRef<HTMLButtonElement, StyledIconButtonProps>(
  ({ icon: Icon, onClick, size, contrast, accessibilityLabel, testID }, ref): ReactElement => (
    <StyledButton
      ref={ref}
      onClick={onClick}
      contrast={contrast}
      type="button"
      {...makeAccessible({ label: accessibilityLabel })}
      {...metaAttribute({ name: MetaConstants.IconButton, testID })}
    >
      <Icon size={size} color="currentColor" />
    </StyledButton>
  ),
);

export default StyledIconButton;
