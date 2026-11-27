import React from 'react';
import type {
  GenUIAction,
  GenUIChartVersion,
  GenUIComponentActionsRegistry,
  GenUIComponentRegistry,
} from './types';
import type { AnimateOptions } from './rehypeAnimate';

/**
 * GenUI context value
 */
type GenUIContextValue = {
  /** Complete component registry (built-in + custom) */
  registry: GenUIComponentRegistry;
  /** Action click handler */
  onActionClick?: (action: GenUIAction) => void;
  /** Consumer-registered action slot render props, keyed by component type */
  componentActions?: GenUIComponentActionsRegistry;
  /** All valid component type names */
  validComponentTypes: string[];
  /** Whether text animation is active (for streaming) */
  isAnimating?: boolean;
  /** Animation options for text streaming */
  animateOptions?: AnimateOptions;
  /** The look of a CHART. See `GenUIConfig.chartVersion`. */
  chartVersion?: GenUIChartVersion;
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

/**
 * Hook to access the consumer-registered action slot registry (safe version that doesn't throw)
 */
const useGenUIComponentActions = (): GenUIComponentActionsRegistry | undefined => {
  const context = React.useContext(GenUIContext);
  return context?.componentActions;
};

/**
 * Hook to access animation state
 */
const useGenUIAnimation = (): { isAnimating: boolean; animateOptions?: AnimateOptions } => {
  const context = React.useContext(GenUIContext);
  return {
    isAnimating: context?.isAnimating ?? false,
    animateOptions: context?.animateOptions,
  };
};

/**
 * Hook to access the CHART version (safe version that doesn't throw). `v2` outside a provider.
 */
const useGenUIChartVersion = (): { chartVersion: GenUIChartVersion } => {
  const context = React.useContext(GenUIContext);
  return { chartVersion: context?.chartVersion ?? 'v2' };
};

export {
  GenUIContext,
  useGenUI,
  useGenUIAction,
  useGenUIComponentActions,
  useGenUIAnimation,
  useGenUIChartVersion,
};
export type { GenUIContextValue };
