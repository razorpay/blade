import { BaseInputProps } from './BaseInput';
import { size } from '../../../tokens/global';
export declare const BASEINPUT_MAX_ROWS = 4;
export declare const TAG_HEIGHT: 20;
export declare const TAG_GAP: 8;
/**
 * 36px
 */
export declare const baseInputHeight: Record<NonNullable<BaseInputProps['size']>, typeof size[keyof typeof size]>;
/**
 * medium - 144px (36px height * 4 rows)
 * large - 192px (48px height * 4 rows)
 */
export declare const baseInputWrapperMaxHeight: {
    readonly medium: number;
    readonly large: number;
};
export declare const baseInputBorderColor: {
    readonly default: "interactive.border.gray.default";
    readonly hovered: "interactive.border.gray.highlighted";
    readonly focused: "interactive.border.primary.default";
    readonly disabled: "interactive.border.gray.disabled";
    readonly error: "interactive.border.negative.default";
    readonly success: "interactive.border.positive.default";
};
export declare const baseInputBackgroundColor: {
    readonly default: "surface.background.gray.intense";
    readonly hovered: "surface.background.gray.moderate";
    readonly focused: "surface.background.gray.moderate";
    readonly disabled: "surface.background.gray.subtle";
    readonly error: "surface.background.gray.intense";
    readonly success: "surface.background.gray.intense";
};
export declare const baseInputBorderlessBackgroundColor: {
    readonly default: "transparent";
    readonly hovered: "surface.background.gray.moderate";
    readonly focused: "surface.background.gray.moderate";
    readonly disabled: "surface.background.gray.intense";
    readonly error: "feedback.background.negative.subtle";
    readonly success: "feedback.background.positive.subtle";
};
export declare const baseInputBorderWidth: {
    readonly default: "thin";
    readonly hovered: "thin";
    readonly disabled: "thin";
    readonly focused: "thick";
    readonly error: "thick";
    readonly success: "thick";
};
export declare const baseInputBorderBackgroundMotion: {
    readonly enter: {
        readonly duration: "xgentle";
        readonly easing: "emphasized";
    };
    readonly exit: {
        readonly duration: "gentle";
        readonly easing: "standard";
    };
};
export declare const baseInputPaddingTokens: {
    readonly top: {
        readonly medium: 3;
        readonly large: 4;
    };
    readonly bottom: {
        readonly medium: 3;
        readonly large: 4;
    };
    readonly left: {
        readonly medium: 4;
        readonly large: 4;
    };
    readonly right: {
        readonly medium: 4;
        readonly large: 4;
    };
};
export declare const formHintLeftLabelMarginLeft: {
    readonly medium: 136;
    readonly large: 192;
};
