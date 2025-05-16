import React from 'react';
import type { PreviewWindowContextType } from './types';

const PreviewWindowContext = React.createContext<PreviewWindowContextType>({
  zoom: 1,
  zoomScaleStep: 0,
  isFullScreen: false,
  defaultZoom: 1,
});

const PreviewWindowProvider = PreviewWindowContext.Provider;

const usePreviewWindowContext = (): PreviewWindowContextType => {
  const context = React.useContext(PreviewWindowContext);
  return context;
};

export { usePreviewWindowContext, PreviewWindowProvider };
