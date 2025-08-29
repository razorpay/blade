import { default as React } from 'react';
type PopoverContextProps = {
    close: () => void;
    defaultInitialFocusRef: React.RefObject<HTMLElement>;
    titleId?: string;
} | null;
declare const PopoverContext: React.Context<PopoverContextProps>;
declare const usePopoverContext: () => NonNullable<PopoverContextProps>;
export { PopoverContext, usePopoverContext };
