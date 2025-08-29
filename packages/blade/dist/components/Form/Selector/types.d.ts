import { default as React } from 'react';
import { DataAnalyticsAttribute, TestID } from '../../../utils/types';
import { Theme } from '../../BladeProvider';
import { DotNotationToken } from '../../../utils/lodashButBetter/get';
type SelectorLabelProps = {
    children: React.ReactNode;
    /**
     * Pass only on react-native
     */
    inputProps: any;
    componentName: string;
    onMouseDown?: React.MouseEventHandler<HTMLLabelElement>;
    onMouseUp?: React.MouseEventHandler<HTMLLabelElement>;
    onMouseOut?: React.MouseEventHandler<HTMLLabelElement>;
    onMouseEnter?: React.MouseEventHandler<HTMLLabelElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLLabelElement>;
    onKeyDown?: React.KeyboardEventHandler<HTMLLabelElement>;
    onKeyUp?: React.KeyboardEventHandler<HTMLLabelElement>;
    onTouchStart?: React.TouchEventHandler<HTMLLabelElement>;
    onTouchEnd?: React.TouchEventHandler<HTMLLabelElement>;
    style?: React.CSSProperties;
} & TestID;
type SelectorInputProps = HoverProps & DataAnalyticsAttribute & {
    id?: string;
    inputProps: any;
    tabIndex?: number;
    accessibilityLabel?: string;
};
type ColorTokens = `colors.${DotNotationToken<Theme['colors']>}`;
type SelectorInputHoverTokens = {
    default: {
        background: {
            checked: ColorTokens;
            unchecked: ColorTokens;
        };
        border?: {
            checked: ColorTokens;
            unchecked: ColorTokens;
        };
    };
};
type HoverProps = {
    isChecked?: boolean;
    isDisabled?: boolean;
    hasError?: boolean;
    hoverTokens: SelectorInputHoverTokens;
};
export type { SelectorLabelProps, SelectorInputProps, HoverProps, SelectorInputHoverTokens };
