import { default as React } from 'react';
import { StyledPropsBlade } from '../Box/styledProps';
import { FeedbackColors } from '../../tokens/theme/theme';
import { DataAnalyticsAttribute, BladeElementRef, TestID } from '../../utils/types';
type ProgressBarCommonProps = {
    /**
     * Sets aria-label to help users know what the progress bar is for. Default value is the same as the `label` passed.
     */
    accessibilityLabel?: string;
    /**
     * Sets the color of the progress bar which changes the feedback color.
     */
    color?: FeedbackColors;
    /**
     * Sets the type of the progress bar.
     * @default 'progress'
     */
    type?: 'meter' | 'progress';
    /**
     * Sets the label to be rendered for the progress bar. This value will also be used as default for `accessibilityLabel`.
     */
    label?: string;
    /**
     * Sets the size of the progress bar.
     * Note: 'large' size isn't available when the variant is 'linear'.
     * @default 'small'
     */
    size?: 'small' | 'medium' | 'large';
    /**
     * Sets the progress value of the progress bar.
     * @default 'small'
     */
    value?: number;
    /**
     * Sets the minimum value for the progress bar.
     * @default 0
     */
    min?: number;
    /**
     * Sets the maximum value for the progress bar.
     * @default 100
     */
    max?: number;
} & TestID & DataAnalyticsAttribute & StyledPropsBlade;
type ProgressBarVariant = 'progress' | 'meter' | 'linear' | 'circular';
type ProgressBarProgressProps = ProgressBarCommonProps & {
    /**
     * Sets the variant to be rendered for the progress bar.
     * @default 'progress'
     */
    variant?: Extract<ProgressBarVariant, 'progress' | 'linear' | 'circular'>;
    /**
     * Sets whether the progress bar is in an indeterminate state.
     * @default false
     */
    isIndeterminate?: boolean;
    /**
     * Sets whether or not to show the progress percentage for the progress bar. Percentage is hidden by default for the `meter` variant.
     * @default true
     */
    showPercentage?: boolean;
};
type ProgressBarMeterProps = ProgressBarCommonProps & {
    /**
     * Sets the variant to be rendered for thr progress bar.
     * @default 'progress'
     */
    variant?: Extract<ProgressBarVariant, 'meter' | 'linear' | 'circular'>;
    /**
     * Sets whether the progress bar is in an indeterminate state.
     * @default false
     */
    isIndeterminate?: undefined;
    /**
     * Sets whether or not to show the progress percentage for the progress bar. Percentage is hidden by default for the `meter` variant.
     * @default false
     */
    showPercentage?: undefined;
};
type ProgressBarProps = ProgressBarProgressProps | ProgressBarMeterProps;
declare const ProgressBar: React.ForwardRefExoticComponent<ProgressBarProps & React.RefAttributes<BladeElementRef>>;
export type { ProgressBarProps, ProgressBarVariant };
export { ProgressBar };
