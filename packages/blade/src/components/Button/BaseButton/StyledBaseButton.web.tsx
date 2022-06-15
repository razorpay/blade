import styled from 'styled-components';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton.d';

const StyledBaseButton = styled.button(
  ({
    activeBorderColor,
    activeColor,
    defaultBorderColor,
    minHeight,
    spacing,
    defaultColor,
    disabled,
    focusBorderColor,
    focusColor,
    focusRingColor,
    hoverBorderColor,
    hoverColor,
    isFullWidth,
    borderWidth,
    borderRadius,
  }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) =>
    getBaseButtonStyles({
      activeBorderColor,
      activeColor,
      defaultBorderColor,
      minHeight,
      spacing,
      defaultColor,
      disabled,
      focusBorderColor,
      focusColor,
      focusRingColor,
      hoverBorderColor,
      hoverColor,
      isFullWidth,
      borderWidth,
      borderRadius,
    }),
);

export default StyledBaseButton;
