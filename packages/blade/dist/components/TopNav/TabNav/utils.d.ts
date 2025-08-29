import { default as React } from 'react';
/**
 * Hook to observe resize events on a given element
 */
declare const useResize: (ref: React.RefObject<HTMLDivElement>, callback?: ((entry: ResizeObserverEntry) => void) | undefined) => void;
declare const MIXED_BG_COLOR = "#e1e7ef";
export { useResize, MIXED_BG_COLOR };
