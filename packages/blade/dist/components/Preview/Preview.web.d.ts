import { default as React } from 'react';
import { PreviewProps, PreviewHeaderProps, PreviewFooterProps, PreviewBodyProps } from './types';
declare const PreviewHeader: ({ title, _onFullScreen, trailing, }: PreviewHeaderProps) => React.ReactElement;
declare const PreviewBody: (PreviewBodyProps: PreviewBodyProps) => React.ReactElement;
declare const PreviewFooter: (PreviewFooterProps: PreviewFooterProps) => React.ReactElement;
declare const Preview: ({ children, onFullScreen: onFullScreenProp, onZoomChange, zoomScaleStep, isDragAndZoomDisabled, defaultZoom, onDragChange, }: PreviewProps) => React.ReactElement;
export { Preview, PreviewHeader, PreviewBody, PreviewFooter };
