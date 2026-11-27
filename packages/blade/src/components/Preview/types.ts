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
  onDragChange?: (position: { x: number; y: number }) => void;
  /**
   * The step of the zoom.
   */
  zoomScaleStep?: number;
  /**
   * The smallest zoom the Preview allows. Zooming out stops here and the Zoom Out button is disabled.
   *
   * @default 0.1
   */
  minZoom?: number;
  /**
   * The largest zoom the Preview allows. Zooming in stops here and the Zoom In button is disabled.
   *
   * @default 8
   */
  maxZoom?: number;
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
  /**
   * Makes the body fill the preview frame and centres its child. Use it to fit content to the
   * frame: give the child `max-width: 100%` and `max-height: 100%` (and `object-fit: contain` for images).
   *
   * Children's percentage heights resolve against the frame when this is set, so an
   * `<img width="100%" height="100%" />` stretches to the frame's shape.
   *
   * @default false
   */
  shouldFillFrame?: boolean;
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
  minZoom: number;
  maxZoom: number;
};

export type {
  PreviewProps,
  PreviewHeaderProps,
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewContextType,
};
