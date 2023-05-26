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
}: Omit<
  StyledBaseButtonProps,
  'children' | 'onClick' | 'accessibilityProps' | 'accessibilityLabel'
>): CSSObject => ({
  minHeight,
  width: isFullWidth ? '100%' : 'auto',
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
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  textDecoration: 'none',
});

export default getBaseButtonStyles;
