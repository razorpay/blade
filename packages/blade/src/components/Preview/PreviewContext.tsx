import React from 'react';
import type { PreviewContextType } from './types';

const PreviewContext = React.createContext<PreviewContextType>({
  zoom: 1,
  zoomScaleStep: 0,
  isFullScreen: false,
  defaultZoom: 1,
});

const PreviewProvider = PreviewContext.Provider;

const usePreviewContext = (): PreviewContextType => {
  const context = React.useContext(PreviewContext);
  return context;
};

export { usePreviewContext, PreviewProvider };
