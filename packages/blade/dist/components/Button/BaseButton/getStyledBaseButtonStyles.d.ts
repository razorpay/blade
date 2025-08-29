import { CSSObject } from 'styled-components';
import { StyledBaseButtonProps } from './types';
declare const getBaseButtonStyles: ({ defaultBorderColor, minHeight, buttonPaddingTop, buttonPaddingBottom, buttonPaddingLeft, buttonPaddingRight, defaultBackgroundColor, disabled, isFullWidth, borderWidth, borderRadius, height, width, }: Omit<StyledBaseButtonProps, 'children' | 'onClick' | 'accessibilityProps' | 'accessibilityLabel'>) => CSSObject;
export default getBaseButtonStyles;
