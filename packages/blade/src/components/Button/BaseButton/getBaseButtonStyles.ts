import type { CSSObject } from 'styled-components';
import type { StyledBaseButtonProps } from './StyledBaseButton';

const getBaseButtonStyles = ({
  activeBorderColor,
  activeColor,
  borderColor,
  minHeight,
  spacing,
  color,
  disabled,
  focusBorderColor,
  focusColor,
  focusRingColor,
  hoverBorderColor,
  hoverColor,
  isFullWidth,
}: Omit<StyledBaseButtonProps, 'children' | 'onClick'>): CSSObject => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  minHeight,
  width: isFullWidth ? '100%' : 'auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: color,
  border: `2px solid ${borderColor}`,
  color: 'white',
  borderRadius: '2px',
  padding: spacing,
  '&:hover': {
    backgroundColor: hoverColor,
    border: `2px solid ${hoverBorderColor}`,
  },
  '&:active': {
    backgroundColor: activeColor,
    border: `2px solid ${activeBorderColor}`,
  },
  '&:focus': {
    backgroundColor: focusColor,
    border: `2px solid ${focusBorderColor}`,
    boxShadow: `0px 0px 0px 4px ${focusRingColor}`,
    outline: 'none',
  },
});

export default getBaseButtonStyles;
