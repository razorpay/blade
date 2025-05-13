import React from 'react';
import type { PreviewWindowContextType } from './types';

const PreviewWindowContext = React.createContext<PreviewWindowContextType>({
  zoom: 1,
  zoomScaleStep: 0,
  isFullScreen: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setControlledZoom: () => {},
  isControlledZoom: false,
});

const PreviewWindowProvider = PreviewWindowContext.Provider;

const usePreviewWindowContext = (): PreviewWindowContextType => {
  const context = React.useContext(PreviewWindowContext);
  return context;
};

export { usePreviewWindowContext, PreviewWindowProvider };
