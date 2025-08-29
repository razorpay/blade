import { CSSObject } from 'styled-components';
import { HeadingProps } from './Heading';
import { Theme } from '../../BladeProvider';
declare const getHeadingStyles: ({ weight, size, theme, color, }: Pick<HeadingProps, "color" | "size" | "weight"> & {
    theme: Theme;
}) => CSSObject;
export default getHeadingStyles;
