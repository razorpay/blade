import { ChipGroupProps } from './ChipGroup';
import { ChipBorderColors, ChipBackgroundColors } from './types';
import { DotNotationSpacingStringToken } from '../../utils/types';
import { SelectorInputHoverTokens } from '../Form/Selector/types';
import { IconProps } from '../Icons';
import { BaseTextProps } from '../Typography/BaseText/types';
import { DurationString, EasingString } from '../../tokens/global';
declare const chipGroupGapTokens: {
    readonly xsmall: {
        readonly right: "spacing.3";
        readonly bottom: "spacing.3";
    };
    readonly small: {
        readonly right: "spacing.3";
        readonly bottom: "spacing.3";
    };
    readonly medium: {
        readonly right: "spacing.3";
        readonly bottom: "spacing.4";
    };
    readonly large: {
        readonly right: "spacing.3";
        readonly bottom: "spacing.4";
    };
};
declare const chipHeightTokens: Record<NonNullable<ChipGroupProps['size']>, number>;
declare const chipGroupLabelSizeTokens: {
    readonly xsmall: "small";
    readonly small: "medium";
    readonly medium: "large";
    readonly large: "large";
};
type ChipHorizontalPaddingTokens = {
    withoutIcon: Record<'left' | 'right', Record<NonNullable<ChipGroupProps['size']>, DotNotationSpacingStringToken>>;
    withIcon: Record<'left' | 'right', Record<NonNullable<ChipGroupProps['size']>, DotNotationSpacingStringToken>>;
};
declare const chipHorizontalPaddingTokens: ChipHorizontalPaddingTokens;
type TextColorTokens = BaseTextProps['color'];
type IconColorTokens = IconProps['color'];
type ChipColorTokens = {
    text: Record<string, TextColorTokens>;
    icon: Record<string, IconColorTokens>;
    background: Record<string, Record<string, ChipBackgroundColors>>;
    border: Record<string, Record<string, ChipBorderColors>>;
};
declare const chipColorTokens: ChipColorTokens;
declare const getChipInputHoverTokens: (color: ChipGroupProps['color']) => SelectorInputHoverTokens;
declare const chipIconSizes: Record<NonNullable<ChipGroupProps['size']>, IconProps['size']>;
declare const chipTextSizes: {
    readonly xsmall: {
        readonly variant: "body";
        readonly size: "small";
    };
    readonly small: {
        readonly variant: "body";
        readonly size: "medium";
    };
    readonly medium: {
        readonly variant: "body";
        readonly size: "large";
    };
    readonly large: {
        readonly variant: "body";
        readonly size: "large";
    };
};
declare const chipMotionTokens: Record<'duration' | 'easing', DurationString | EasingString>;
export { chipColorTokens, chipHeightTokens, chipGroupGapTokens, getChipInputHoverTokens, chipHorizontalPaddingTokens, chipTextSizes, chipIconSizes, chipMotionTokens, chipGroupLabelSizeTokens, };
