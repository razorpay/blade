import { DotNotationToken } from '../../utils/lodashButBetter/get';
import { Theme } from '../BladeProvider';
import { SelectorInputHoverTokens } from '../Form/Selector/types';
declare const checkboxSizes: {
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
                readonly mobile: "spacing.3";
                readonly desktop: "spacing.3";
            };
        };
    };
    readonly icon: {
        readonly small: {
            readonly width: 12;
            readonly height: 12;
        };
        readonly medium: {
            readonly width: 16;
            readonly height: 16;
        };
        readonly large: {
            readonly width: 20;
            readonly height: 20;
        };
    };
};
type ColorTokens = `colors.${DotNotationToken<Theme['colors']>}`;
type Variant = {
    border: {
        checked: ColorTokens;
        unchecked: ColorTokens;
    };
    background: {
        checked: ColorTokens;
        unchecked: ColorTokens;
    };
};
type CheckboxIconColors = {
    variants: {
        default: Variant;
        disabled: Variant;
        negative: Variant;
    };
};
declare const checkboxIconColors: CheckboxIconColors;
declare const checkboxHoverTokens: SelectorInputHoverTokens;
export { checkboxSizes, checkboxIconColors, checkboxHoverTokens };
