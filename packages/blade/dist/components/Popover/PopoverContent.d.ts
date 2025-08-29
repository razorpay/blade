import { default as React } from 'react';
declare const PopoverContent: React.ForwardRefExoticComponent<{
    style: React.CSSProperties;
    arrow: React.ReactNode;
    zIndex?: number | undefined;
    isVisible?: boolean | undefined;
    side?: import('@floating-ui/utils').Side | undefined;
} & Pick<import('./types').PopoverProps, "children" | "footer" | "title" | "titleLeading"> & React.RefAttributes<HTMLDivElement>>;
export { PopoverContent };
