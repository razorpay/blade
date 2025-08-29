import { Theme } from '../BladeProvider';
import { SelectorInputHoverTokens } from '../Form/Selector/types';
import { DotNotationToken } from '../../utils/lodashButBetter/get';
declare const radioSizes: {
    readonly group: {
        readonly gap: {
            readonly small: {
                readonly mobile: "spacing.2";
                readonly desktop: "spacing.2";
            };
            readonly medium: {
                readonly mobile: "spacing.3";
                readonly desktop: "spacing.3";
            };
            readonly large: {
                readonly mobile: "spacing.4";
                readonly desktop: "spacing.4";
            };
        };
    };
    readonly icon: {
        readonly small: {
            readonly width: 12;
            readonly height: 12;
            readonly dotRadius: 2;
        };
        readonly medium: {
            readonly width: 16;
            readonly height: 16;
            readonly dotRadius: 3;
        };
        readonly large: {
            readonly width: 20;
            readonly height: 20;
            readonly dotRadius: 4;
        };
    };
};
type ColorTokens = `colors.${DotNotationToken<Theme['colors']>}`;
type Variant = {
    dot: {
        checked: ColorTokens;
        unchecked: ColorTokens;
    };
    border: {
        checked: ColorTokens;
        unchecked: ColorTokens;
    };
    background: {
        checked: ColorTokens;
        unchecked: ColorTokens;
    };
};
type RadioIconColors = {
    variants: {
        default: Variant;
        disabled: Variant;
        negative: Variant;
    };
};
declare const radioIconColors: RadioIconColors;
declare const radioHoverTokens: SelectorInputHoverTokens;
export { radioSizes, radioIconColors, radioHoverTokens };
