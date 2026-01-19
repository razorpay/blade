import React from 'react';
import type { GenUIAction, GenUIComponentRegistry } from './types';

/**
 * GenUI context value
 */
type GenUIContextValue = {
  /** Complete component registry (built-in + custom) */
  registry: GenUIComponentRegistry;
  /** Action click handler */
  onActionClick?: (action: GenUIAction) => void;
  /** All valid component type names */
  validComponentTypes: string[];
};

const GenUIContext = React.createContext<GenUIContextValue | null>(null);

/**
 * Hook to access GenUI context
 * @throws Error if used outside GenUIProvider
 */
const useGenUI = (): GenUIContextValue => {
  const context = React.useContext(GenUIContext);
  if (!context) {
    throw new Error('useGenUI must be used within a GenUIProvider');
  }
  return context;
};

/**
 * Hook to access action click handler (safe version that doesn't throw)
 */
const useGenUIAction = (): ((action: GenUIAction) => void) | undefined => {
  const context = React.useContext(GenUIContext);
  return context?.onActionClick;
};

export { GenUIContext, useGenUI, useGenUIAction };
export type { GenUIContextValue };
