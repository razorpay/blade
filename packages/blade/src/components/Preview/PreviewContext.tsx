import React from 'react';
import type { PreviewContextType } from './types';

const PREVIEW_DEFAULT_MIN_ZOOM = 0.1;
const PREVIEW_DEFAULT_MAX_ZOOM = 8;

const PreviewContext = React.createContext<PreviewContextType>({
  zoom: 1,
  zoomScaleStep: 0,
  isFullScreen: false,
  defaultZoom: 1,
  minZoom: PREVIEW_DEFAULT_MIN_ZOOM,
  maxZoom: PREVIEW_DEFAULT_MAX_ZOOM,
});

const PreviewProvider = PreviewContext.Provider;

const usePreviewContext = (): PreviewContextType => {
  const context = React.useContext(PreviewContext);
  return context;
};

export { usePreviewContext, PreviewProvider, PREVIEW_DEFAULT_MIN_ZOOM, PREVIEW_DEFAULT_MAX_ZOOM };
