import { CSSObject, DefaultTheme } from 'styled-components';
import { NavigationButtonProps } from './types';
declare const getNavigationButtonStyles: (props: {
    theme: DefaultTheme;
    isPressed?: boolean;
    variant: NavigationButtonProps['variant'];
}) => CSSObject;
export { getNavigationButtonStyles };
