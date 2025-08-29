import { default as React } from 'react';
import { PreviewContextType } from './types';
declare const PreviewProvider: React.Provider<PreviewContextType>;
declare const usePreviewContext: () => PreviewContextType;
export { usePreviewContext, PreviewProvider };
