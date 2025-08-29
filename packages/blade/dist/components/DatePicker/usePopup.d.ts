import { UseFloatingOptions } from '@floating-ui/react';
type UsePopupProps = {
    enabled?: boolean;
    open?: boolean;
    placement: UseFloatingOptions['placement'];
    onOpenChange?: UseFloatingOptions['onOpenChange'];
    referenceRef: React.RefObject<HTMLButtonElement>;
    crossAxisOffset?: number;
};
declare const usePopup: ({ enabled, placement, open, onOpenChange, referenceRef, crossAxisOffset, }: UsePopupProps) => {
    readonly refs: {
        reference: import('react').MutableRefObject<import('@floating-ui/react-dom').ReferenceType | null>;
        floating: import('react').MutableRefObject<HTMLElement | null>;
        setReference: (node: import('@floating-ui/react-dom').ReferenceType | null) => void;
        setFloating: (node: HTMLElement | null) => void;
    } & import('@floating-ui/react').ExtendedRefs<import('@floating-ui/react').ReferenceType>;
    readonly context: {
        x: number;
        y: number;
        placement: import('@floating-ui/utils').Placement;
        strategy: import('@floating-ui/utils').Strategy;
        middlewareData: import('@floating-ui/core').MiddlewareData;
        isPositioned: boolean;
        update: () => void;
        floatingStyles: import('react').CSSProperties;
        open: boolean;
        onOpenChange: (open: boolean, event?: Event | undefined, reason?: import('@floating-ui/react').OpenChangeReason | undefined) => void;
        events: import('@floating-ui/react').FloatingEvents;
        dataRef: import('react').MutableRefObject<import('@floating-ui/react').ContextData>;
        nodeId: string | undefined;
        floatingId: string;
        refs: import('@floating-ui/react').ExtendedRefs<import('@floating-ui/react').ReferenceType>;
        elements: import('@floating-ui/react').ExtendedElements<import('@floating-ui/react').ReferenceType>;
    };
    readonly isMounted: boolean;
    readonly floatingStyles: import('react').CSSProperties;
    readonly animationStyles: import('react').CSSProperties;
    readonly getReferenceProps: (userProps?: import('react').HTMLProps<Element> | undefined) => Record<string, unknown>;
    readonly getFloatingProps: (userProps?: import('react').HTMLProps<HTMLElement> | undefined) => Record<string, unknown>;
};
export { usePopup };
