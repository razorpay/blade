import { CSSObject, DefaultTheme } from 'styled-components';
import { IndicatorButtonProps } from './types';
declare const getIndicatorButtonStyles: ({ theme, isActive, variant, }: {
    theme: DefaultTheme;
} & Pick<IndicatorButtonProps, "variant" | "isActive">) => CSSObject;
export { getIndicatorButtonStyles };
