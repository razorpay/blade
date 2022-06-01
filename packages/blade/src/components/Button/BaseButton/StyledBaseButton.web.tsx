import styled from 'styled-components';
import getBaseButtonStyles from './getBaseButtonStyles';
import type { StyledBaseButtonProps } from './StyledBaseButton.d';

const StyledBaseButton = styled.button(
  ({
    color,
    hoverColor,
    activeColor,
    minHeight,
    spacing,
  }: Omit<StyledBaseButtonProps, 'children' | 'onClick'>) =>
    getBaseButtonStyles({ color, hoverColor, activeColor, minHeight, spacing }),
);

export default StyledBaseButton;
