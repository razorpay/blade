import { CSSObject } from 'styled-components';
import { TextProps, TextVariant } from './Text';
import { Theme } from '../../BladeProvider';
declare const getTextStyles: <T extends {
    variant: TextVariant;
}>({ variant, weight, size, theme, color, }: Pick<TextProps<T>, "color" | "size" | "weight" | "variant"> & {
    theme: Theme;
}) => CSSObject;
export default getTextStyles;
