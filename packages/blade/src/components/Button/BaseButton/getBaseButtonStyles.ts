import type { CSSObject } from 'styled-components';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
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
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  minHeight,
  width: isFullWidth ? '100%' : 'auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: defaultColor,
  borderColor: defaultBorderColor,
  borderWidth,
  borderRadius,
  borderStyle: 'solid',
  padding: spacing,
  '&:hover': {
    backgroundColor: hoverColor,
    borderColor: hoverBorderColor,
  },
  '&:active': {
    backgroundColor: activeColor,
    borderColor: activeBorderColor,
  },
  '&:focus': {
    backgroundColor: focusColor,
    borderColor: focusBorderColor,
    boxShadow: `0px 0px 0px 4px ${focusRingColor}`,
    outline: 'none',
  },
});

export default getBaseButtonStyles;
