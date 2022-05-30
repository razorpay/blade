import styled from 'styled-components';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton.d';

const StyledBaseButton = styled.button(
  ({
    activeBorderColor,
    activeColor,
    borderColor,
    buttonHeight,
    buttonSpacing,
    color,
    disabled,
    focusBorderColor,
    focusColor,
    focusRingColor,
    hoverBorderColor,
    hoverColor,
    isFullWidth,
  }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) =>
    getBaseButtonStyles({
      activeBorderColor,
      activeColor,
      borderColor,
      buttonHeight,
      buttonSpacing,
      color,
      disabled,
      focusBorderColor,
      focusColor,
      focusRingColor,
      hoverBorderColor,
      hoverColor,
      isFullWidth,
    }),
);

export default StyledBaseButton;
