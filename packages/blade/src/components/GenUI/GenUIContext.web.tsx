import React from 'react';
import type {
  GenUIAction,
  GenUIChartLayout,
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
  /** How a CHART sizes and draws itself. See `GenUIConfig.chartLayout`. */
  chartLayout?: GenUIChartLayout;
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
 * Hook to access the CHART layout (safe version that doesn't throw). `fixed` outside a provider.
 */
const useGenUIChartLayout = (): { chartLayout: GenUIChartLayout } => {
  const context = React.useContext(GenUIContext);
  return { chartLayout: context?.chartLayout ?? 'fixed' };
};

export {
  GenUIContext,
  useGenUI,
  useGenUIAction,
  useGenUIComponentActions,
  useGenUIAnimation,
  useGenUIChartLayout,
};
export type { GenUIContextValue };
