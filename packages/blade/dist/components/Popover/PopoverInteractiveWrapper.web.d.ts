import { default as React } from 'react';
import { BaseBoxProps } from '../Box/BaseBox';
import { DataAnalyticsAttribute } from '../../utils/types';
type PopoverInteractiveWrapper = {
    /**
     * A label for screen readers to announce when the popover is opened.
     */
    accessibilityLabel?: string;
    /**
     * The content of the PopoverInteractiveWrapper.
     */
    children?: React.ReactNode;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
} & Omit<BaseBoxProps, 'as'> & DataAnalyticsAttribute;
declare const PopoverInteractiveWrapper: React.ForwardRefExoticComponent<{
    /**
     * A label for screen readers to announce when the popover is opened.
     */
    accessibilityLabel?: string | undefined;
    /**
     * The content of the PopoverInteractiveWrapper.
     */
    children?: React.ReactNode;
    onClick?: ((event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void) | undefined;
    onKeyDown?: ((event: React.KeyboardEvent<HTMLButtonElement>) => void) | undefined;
} & Omit<BaseBoxProps, "as"> & DataAnalyticsAttribute & React.RefAttributes<HTMLButtonElement>>;
export { PopoverInteractiveWrapper };
