import { TabsProps } from './types';
import { DotNotationSpacingStringToken } from '../../utils/types';
type TabSizes = NonNullable<TabsProps['size']>;
type TabVariants = Exclude<NonNullable<TabsProps['variant']>, 'borderless'>;
type TabOrientation = 'horizontal' | 'vertical';
type TabItemPadding = Record<TabVariants, Record<TabOrientation, Record<TabSizes, DotNotationSpacingStringToken>>>;
declare const paddingTop: TabItemPadding;
declare const paddingBottom: TabItemPadding;
declare const paddingX: TabItemPadding;
declare const trackColor = "surface.border.gray.muted";
declare const textColor: {
    readonly selected: {
        readonly default: "interactive.text.primary.subtle";
        readonly highlighted: "interactive.text.primary.normal";
        readonly disabled: "interactive.text.primary.normal";
    };
    readonly unselected: {
        readonly default: "interactive.text.gray.muted";
        readonly highlighted: "interactive.text.gray.subtle";
        readonly disabled: "interactive.text.gray.disabled";
    };
};
declare const backgroundColor: {
    readonly unselected: {
        readonly bordered: {
            readonly default: "colors.transparent";
            readonly highlighted: "colors.transparent";
            readonly disabled: "colors.transparent";
        };
        readonly borderless: {
            readonly default: "colors.transparent";
            readonly highlighted: "colors.transparent";
            readonly disabled: "colors.transparent";
        };
        readonly filled: {
            readonly default: "colors.transparent";
            readonly highlighted: "colors.interactive.background.gray.default";
            readonly disabled: "colors.transparent";
        };
    };
    readonly selected: {
        readonly bordered: {
            readonly default: "colors.transparent";
            readonly highlighted: "colors.transparent";
            readonly disabled: "colors.transparent";
        };
        readonly borderless: {
            readonly default: "colors.transparent";
            readonly highlighted: "colors.transparent";
            readonly disabled: "colors.transparent";
        };
        readonly filled: {
            readonly default: "colors.interactive.background.primary.faded";
            readonly highlighted: "colors.interactive.background.primary.faded";
            readonly disabled: "colors.transparent";
        };
    };
};
declare const iconColor: {
    readonly unselected: {
        readonly default: "interactive.icon.gray.muted";
        readonly highlighted: "interactive.icon.gray.subtle";
        readonly disabled: "interactive.icon.gray.disabled";
    };
    readonly selected: {
        readonly default: "interactive.icon.primary.subtle";
        readonly highlighted: "interactive.icon.primary.normal";
        readonly disabled: "interactive.icon.primary.disabled";
    };
};
declare const textSizeMap: {
    readonly small: "medium";
    readonly medium: "medium";
    readonly large: "large";
};
export { backgroundColor, textColor, iconColor, trackColor, paddingTop, paddingBottom, paddingX, textSizeMap, };
