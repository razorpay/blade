import { BaseButtonProps } from './BaseButton';
import { Theme } from '../../BladeProvider';
import { IconSize } from '../../Icons';
import { SpinnerProps } from '../../Spinner';
import { Size } from '../../../tokens/global';
import { FeedbackColors } from '../../../tokens/theme/theme';
export type ButtonMinHeight = Size[28] | Size[32] | Size[36] | Size[48];
export type ButtonTypography = {
    fonts: {
        size: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['typography']['fonts']['size']>;
    };
    lineHeights: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['typography']['lineHeights']>;
};
declare const backgroundColor: (property: 'background' | 'border') => {
    readonly base: {
        readonly primary: {
            readonly default: "interactive.background.primary.default" | "interactive.border.primary.default";
            readonly highlighted: "interactive.background.primary.highlighted" | "interactive.border.primary.highlighted";
            readonly disabled: "interactive.background.primary.disabled" | "interactive.border.primary.disabled";
        };
        readonly secondary: {
            readonly default: "transparent" | "interactive.border.primary.default";
            readonly highlighted: "interactive.background.primary.faded" | "interactive.border.primary.default";
            readonly disabled: "transparent" | "interactive.border.primary.disabled";
        };
        readonly tertiary: {
            readonly default: "interactive.background.gray.default" | "interactive.border.gray.default";
            readonly highlighted: "interactive.background.gray.highlighted" | "interactive.border.gray.highlighted";
            readonly disabled: "interactive.background.gray.disabled" | "interactive.border.gray.disabled";
        };
        readonly transparent: {
            readonly default: "transparent";
            readonly highlighted: "interactive.background.gray.faded" | "interactive.border.gray.faded";
            readonly disabled: "interactive.background.gray.disabled" | "interactive.border.gray.disabled";
        };
    };
    readonly white: {
        readonly primary: {
            readonly default: "interactive.background.staticWhite.default" | "interactive.border.staticWhite.default";
            readonly highlighted: "interactive.background.staticWhite.highlighted" | "interactive.border.staticWhite.highlighted";
            readonly disabled: "interactive.background.staticWhite.disabled" | "interactive.border.staticWhite.disabled";
        };
        readonly secondary: {
            readonly default: "transparent" | "interactive.border.staticWhite.highlighted";
            readonly highlighted: "interactive.background.staticWhite.faded" | "interactive.border.staticWhite.highlighted";
            readonly disabled: "transparent" | "interactive.border.staticWhite.disabled";
        };
        readonly tertiary: {
            readonly default: "interactive.background.staticWhite.faded";
            readonly highlighted: "interactive.background.staticWhite.fadedHighlighted";
            readonly disabled: "interactive.background.staticWhite.disabled";
        };
    };
    readonly transparent: {
        readonly tertiary: {
            readonly default: "transparent";
            readonly highlighted: "interactive.background.gray.faded";
            readonly disabled: "interactive.background.staticWhite.disabled";
        };
    };
    readonly color: (color: FeedbackColors) => {
        readonly primary: {
            readonly default: "interactive.background.neutral.default" | "interactive.background.information.default" | "interactive.background.negative.default" | "interactive.background.notice.default" | "interactive.background.positive.default" | "interactive.border.neutral.default" | "interactive.border.information.default" | "interactive.border.negative.default" | "interactive.border.notice.default" | "interactive.border.positive.default";
            readonly highlighted: "interactive.background.neutral.highlighted" | "interactive.background.information.highlighted" | "interactive.background.negative.highlighted" | "interactive.background.notice.highlighted" | "interactive.background.positive.highlighted" | "interactive.border.neutral.highlighted" | "interactive.border.information.highlighted" | "interactive.border.negative.highlighted" | "interactive.border.notice.highlighted" | "interactive.border.positive.highlighted";
            readonly disabled: "interactive.background.neutral.disabled" | "interactive.background.information.disabled" | "interactive.background.negative.disabled" | "interactive.background.notice.disabled" | "interactive.background.positive.disabled" | "interactive.border.neutral.disabled" | "interactive.border.information.disabled" | "interactive.border.negative.disabled" | "interactive.border.notice.disabled" | "interactive.border.positive.disabled";
        };
        readonly secondary: {
            readonly default: "interactive.background.neutral.faded" | "interactive.background.information.faded" | "interactive.background.negative.faded" | "interactive.background.notice.faded" | "interactive.background.positive.faded" | "interactive.border.neutral.default" | "interactive.border.information.default" | "interactive.border.negative.default" | "interactive.border.notice.default" | "interactive.border.positive.default";
            readonly highlighted: "interactive.background.neutral.fadedHighlighted" | "interactive.background.information.fadedHighlighted" | "interactive.background.negative.fadedHighlighted" | "interactive.background.notice.fadedHighlighted" | "interactive.background.positive.fadedHighlighted" | "interactive.border.neutral.default" | "interactive.border.information.default" | "interactive.border.negative.default" | "interactive.border.notice.default" | "interactive.border.positive.default";
            readonly disabled: "interactive.background.neutral.disabled" | "interactive.background.information.disabled" | "interactive.background.negative.disabled" | "interactive.background.notice.disabled" | "interactive.background.positive.disabled" | "interactive.border.neutral.disabled" | "interactive.border.information.disabled" | "interactive.border.negative.disabled" | "interactive.border.notice.disabled" | "interactive.border.positive.disabled";
        };
    };
};
declare const textColor: (property: 'icon' | 'text') => {
    readonly base: {
        readonly primary: {
            readonly default: "interactive.text.onPrimary.normal" | "interactive.icon.onPrimary.normal";
            readonly highlighted: "interactive.text.onPrimary.normal" | "interactive.icon.onPrimary.normal";
            readonly disabled: "interactive.text.primary.disabled" | "interactive.icon.primary.disabled";
        };
        readonly secondary: {
            readonly default: "interactive.text.primary.subtle" | "interactive.icon.primary.subtle";
            readonly highlighted: "interactive.text.primary.subtle" | "interactive.icon.primary.subtle";
            readonly disabled: "interactive.text.primary.disabled" | "interactive.icon.primary.disabled";
        };
        readonly tertiary: {
            readonly default: "interactive.text.gray.normal" | "interactive.icon.gray.normal";
            readonly highlighted: "interactive.text.gray.normal" | "interactive.icon.gray.normal";
            readonly disabled: "interactive.text.gray.disabled" | "interactive.icon.gray.disabled";
        };
    };
    readonly white: {
        readonly primary: {
            readonly default: "interactive.text.staticBlack.muted" | "interactive.icon.staticBlack.muted";
            readonly highlighted: "interactive.text.staticBlack.muted" | "interactive.icon.staticBlack.muted";
            readonly disabled: "interactive.text.staticBlack.disabled" | "interactive.icon.staticBlack.disabled";
        };
        readonly secondary: {
            readonly default: "interactive.text.staticWhite.normal" | "interactive.icon.staticWhite.normal";
            readonly highlighted: "interactive.text.staticWhite.normal" | "interactive.icon.staticWhite.normal";
            readonly disabled: "interactive.text.staticWhite.disabled" | "interactive.icon.staticWhite.disabled";
        };
        readonly tertiary: {
            readonly default: "interactive.text.staticWhite.normal" | "interactive.icon.staticWhite.normal";
            readonly highlighted: "interactive.text.staticWhite.normal" | "interactive.icon.staticWhite.normal";
            readonly disabled: "interactive.text.staticWhite.disabled" | "interactive.icon.staticWhite.disabled";
        };
    };
    readonly transparent: {
        readonly tertiary: {
            readonly default: "interactive.icon.gray.muted" | "surface.text.gray.normal";
            readonly highlighted: "interactive.icon.gray.subtle" | "surface.text.gray.normal";
            readonly disabled: "interactive.text.gray.disabled" | "interactive.icon.gray.disabled";
        };
    };
    readonly color: (color: FeedbackColors) => {
        readonly primary: {
            readonly default: "interactive.text.staticWhite.normal" | "interactive.icon.staticWhite.normal";
            readonly highlighted: "interactive.text.staticWhite.normal" | "interactive.icon.staticWhite.normal";
            readonly disabled: "interactive.text.neutral.disabled" | "interactive.text.information.disabled" | "interactive.text.negative.disabled" | "interactive.text.notice.disabled" | "interactive.text.positive.disabled" | "interactive.icon.neutral.disabled" | "interactive.icon.information.disabled" | "interactive.icon.negative.disabled" | "interactive.icon.notice.disabled" | "interactive.icon.positive.disabled";
        };
        readonly secondary: {
            readonly default: "interactive.text.neutral.normal" | "interactive.text.information.normal" | "interactive.text.negative.normal" | "interactive.text.notice.normal" | "interactive.text.positive.normal" | "interactive.icon.neutral.normal" | "interactive.icon.information.normal" | "interactive.icon.negative.normal" | "interactive.icon.notice.normal" | "interactive.icon.positive.normal";
            readonly highlighted: "interactive.text.neutral.normal" | "interactive.text.information.normal" | "interactive.text.negative.normal" | "interactive.text.notice.normal" | "interactive.text.positive.normal" | "interactive.icon.neutral.normal" | "interactive.icon.information.normal" | "interactive.icon.negative.normal" | "interactive.icon.notice.normal" | "interactive.icon.positive.normal";
            readonly disabled: "interactive.text.neutral.disabled" | "interactive.text.information.disabled" | "interactive.text.negative.disabled" | "interactive.text.notice.disabled" | "interactive.text.positive.disabled" | "interactive.icon.neutral.disabled" | "interactive.icon.information.disabled" | "interactive.icon.negative.disabled" | "interactive.icon.notice.disabled" | "interactive.icon.positive.disabled";
        };
    };
};
declare const typography: ButtonTypography;
declare const minHeight: Record<NonNullable<BaseButtonProps['size']>, ButtonMinHeight>;
declare const buttonPadding: Record<NonNullable<BaseButtonProps['size']>, Record<'top' | 'bottom' | 'left' | 'right', keyof Theme['spacing']>>;
declare const buttonIconOnlyHeightWidth: {
    readonly xsmall: "28px";
    readonly small: "32px";
    readonly medium: "36px";
    readonly large: "48px";
};
declare const buttonSizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconSize>;
declare const buttonIconOnlySizeToIconSizeMap: Record<NonNullable<BaseButtonProps['size']>, IconSize>;
declare const buttonSizeToSpinnerSizeMap: Record<NonNullable<BaseButtonProps['size']>, SpinnerProps['size']>;
declare const buttonIconPadding: Record<NonNullable<BaseButtonProps['size']>, keyof Theme['spacing']>;
export { backgroundColor, textColor, typography, minHeight, buttonSizeToIconSizeMap, buttonIconOnlySizeToIconSizeMap, buttonSizeToSpinnerSizeMap, buttonIconPadding, buttonPadding, buttonIconOnlyHeightWidth, };
