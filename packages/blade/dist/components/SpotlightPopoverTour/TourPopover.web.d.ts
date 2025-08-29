import { default as React } from 'react';
import { PopoverProps } from '../Popover';
type TourPopoverProps = Omit<PopoverProps, 'children' | 'initialFocusRef'> & {
    attachTo: React.RefObject<HTMLElement> | undefined;
    isTransitioning: boolean;
};
declare const TourPopover: ({ attachTo, content, title, titleLeading, footer, placement, onOpenChange, zIndex, isOpen, defaultIsOpen, isTransitioning, }: TourPopoverProps) => React.ReactElement;
export { TourPopover };
