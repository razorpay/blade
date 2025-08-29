import { Side, UseFloatingOptions } from '@floating-ui/react';
import { CSSProperties } from 'react';
import { BaseBoxProps } from '../Box/BaseBox';
import { DataAnalyticsAttribute } from '../../utils/types';
type TooltipProps = {
    /**
     * Tooltip title
     */
    title?: string;
    /**
     * Tooltip content
     */
    content: string;
    /**
     * Placement of tooltip
     *
     * @default "top"
     */
    placement?: Exclude<UseFloatingOptions['placement'], 'left-end' | 'left-start' | 'right-end' | 'right-start'>;
    children: React.ReactElement;
    onOpenChange?: ({ isOpen }: {
        isOpen: boolean;
    }) => void;
    /**
     * Sets the z-index of the modal
     * @default 1100
     */
    zIndex?: number;
} & DataAnalyticsAttribute;
type TooltipContentProps = {
    title?: string;
    children: string;
    style: CSSProperties;
    arrow: React.ReactNode;
    /**
     * react-native only
     */
    isVisible?: boolean;
    /**
     * react-native only
     */
    side?: Side;
};
type TooltipContentWrapperProps = {
    styles: CSSProperties;
    side?: Side;
    isVisible?: boolean;
} & BaseBoxProps;
export type { TooltipProps, TooltipContentProps, TooltipContentWrapperProps };
