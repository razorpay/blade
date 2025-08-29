import { CSSObject } from 'styled-components';
import { Theme } from '../../BladeProvider';
declare const getBaseInputBorderStyles: ({ theme, borderWidth, borderColor, isFocused, }: {
    theme: Theme;
    borderWidth: number;
    borderColor: string;
    isFocused?: boolean | undefined;
}) => CSSObject;
export { getBaseInputBorderStyles };
