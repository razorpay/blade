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
};

type PreviewBodyProps = {
  children: React.ReactElement;
};

type PreviewFooterProps = {
  trailing?: React.ReactElement;
  showZoomPercentage?: boolean;
};

export type { PreviewWindowProps, PreviewHeaderProps, PreviewBodyProps, PreviewFooterProps };
