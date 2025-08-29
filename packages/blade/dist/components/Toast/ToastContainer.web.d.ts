import { default as React } from 'react';
type ToastContainerProps = {
    /**
     * The offset from the bottom of the screen to the toast container.
     * This is useful when you want to position the toast container at a different
     * position from the bottom of the screen.
     *
     * @default isMobile ? 16px : 24px
     */
    offsetBottom?: number;
};
declare const ToastContainer: ({ offsetBottom }: ToastContainerProps) => React.ReactElement;
export { ToastContainer };
