import type { CSSObject } from 'styled-components';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
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
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  minHeight,
  width: isFullWidth ? '100%' : 'auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: defaultBackgroundColor,
  borderColor: defaultBorderColor,
  borderWidth,
  borderRadius,
  borderStyle: 'solid',
  padding: spacing,
  '&:hover': {
    backgroundColor: hoverBackgroundColor,
    borderColor: hoverBorderColor,
  },
  '&:active': {
    backgroundColor: activeBackgroundColor,
    borderColor: activeBorderColor,
  },
  '&:focus': {
    backgroundColor: focusBackgroundColor,
    borderColor: focusBorderColor,
    boxShadow: `0px 0px 0px 4px ${focusRingColor}`,
    outline: 'none',
  },
});

export default getBaseButtonStyles;
