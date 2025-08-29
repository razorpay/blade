/// <reference types="react" />
type PreviewProps = {
    /**
     * The children of the Preview component.
     */
    children: React.ReactElement | React.ReactElement[];
    /**
     * The function to call when the full screen button is clicked.
     */
    onFullScreen?: () => void;
    /**
     * Whether the drag and zoom is disabled.
     */
    isDragAndZoomDisabled?: boolean;
    /**
     * The initial zoom of the Preview component.
     */
    defaultZoom?: number;
    /**
     * The function to call when the zoom changes.
     */
    onZoomChange?: (newZoom: number) => void;
    /**
     * The function to call when the drag changes.
     */
    onDragChange?: (position: {
        x: number;
        y: number;
    }) => void;
    /**
     * The step of the zoom.
     */
    zoomScaleStep?: number;
};
type PreviewHeaderProps = {
    /**
     * The title of the PreviewHeader component.
     */
    title?: string;
    /**
     * The trailing of the PreviewHeader component.
     */
    trailing?: React.ReactElement | React.ReactElement[];
    /**
     * The function to call when the full screen button is clicked.
     * @private
     */
    _onFullScreen?: () => void;
};
type PreviewBodyProps = {
    /**
     * The children of the PreviewBody component.
     */
    children: React.ReactElement;
};
type PreviewFooterProps = {
    /**
     * The trailing of the PreviewFooter component.
     */
    trailing?: React.ReactElement;
    /**
     * Whether to show the zoom percentage.
     */
    showZoomPercentage?: boolean;
};
type PreviewContextType = {
    zoom: number;
    zoomScaleStep: number;
    isFullScreen: boolean;
    defaultZoom: number;
};
export type { PreviewProps, PreviewHeaderProps, PreviewBodyProps, PreviewFooterProps, PreviewContextType, };
