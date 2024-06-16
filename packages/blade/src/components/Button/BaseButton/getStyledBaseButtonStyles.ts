import type { CSSObject } from 'styled-components';
import type { StyledBaseButtonProps } from './types';

const getBaseButtonStyles = ({
  defaultBorderColor,
  minHeight,
  buttonPaddingTop,
  buttonPaddingBottom,
  buttonPaddingLeft,
  buttonPaddingRight,
  defaultBackgroundColor,
  disabled,
  isFullWidth,
  borderWidth,
  borderRadius,
  height,
  width = 'auto',
}: Omit<
  StyledBaseButtonProps,
  'children' | 'onClick' | 'accessibilityProps' | 'accessibilityLabel'
>): CSSObject => ({
  minHeight,
  height,
  width: isFullWidth ? '100%' : width,
  cursor: disabled ? 'not-allowed' : 'pointer',
  backgroundColor: defaultBackgroundColor,
  borderColor: defaultBorderColor,
  borderWidth,
  borderRadius,
  borderStyle: 'solid',
  paddingTop: buttonPaddingTop,
  paddingBottom: buttonPaddingBottom,
  paddingLeft: buttonPaddingLeft,
  paddingRight: buttonPaddingRight,
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
  overflow: 'hidden',
});

export default getBaseButtonStyles;
