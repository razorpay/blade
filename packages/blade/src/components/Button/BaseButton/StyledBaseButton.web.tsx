import styled from 'styled-components';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton.d';

const StyledBaseButton = styled.button(
  ({
    activeBorderColor,
    activeBackgroundColor,
    defaultBorderColor,
    minHeight,
    spacing,
    defaultBackgroundColor,
    disabled,
    focusBorderColor,
    focusBackgroundColor,
    focusRingColor,
    hoverBorderColor,
    hoverBackgroundColor,
    isFullWidth,
    borderWidth,
    borderRadius,
  }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) =>
    getBaseButtonStyles({
      activeBorderColor,
      activeBackgroundColor,
      defaultBorderColor,
      minHeight,
      spacing,
      defaultBackgroundColor,
      disabled,
      focusBorderColor,
      focusBackgroundColor,
      focusRingColor,
      hoverBorderColor,
      hoverBackgroundColor,
      isFullWidth,
      borderWidth,
      borderRadius,
    }),
);

export default StyledBaseButton;
