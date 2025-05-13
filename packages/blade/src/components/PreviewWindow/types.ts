type PreviewWindowProps = {
  children: React.ReactElement | React.ReactElement[];
  onFullScreen?: () => void;
  isDragEnabled?: boolean;
  zoom?: number;
  onZoomChange?: (newZoom: number) => void;
  onDragChange?: (position: { x: number; y: number }) => void;
  defaultZoom?: number;
  zoomScaleStep?: number;
};

type PreviewHeaderProps = {
  title?: string;
  trailing?: React.ReactElement;
  _onFullScreen?: () => void;
};

type PreviewBodyProps = {
  children: React.ReactElement;
};

type PreviewFooterProps = {
  trailing?: React.ReactElement;
  showZoomPercentage?: boolean;
};

type PreviewWindowContextType = {
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onDragChange: (position: { x: number; y: number }) => void;
  defaultZoom: number;
  zoomScaleStep: number;
  isFullScreen: boolean;
};

export type {
  PreviewWindowProps,
  PreviewHeaderProps,
  PreviewBodyProps,
  PreviewFooterProps,
  PreviewWindowContextType,
};
