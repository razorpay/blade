import React from 'react';
import type {
  GenUIAction,
  GenUICardLayout,
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
  /** How blocks inside a CARD are laid out */
  cardLayout?: GenUICardLayout;
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
 * Hook to access the card layout (safe version that doesn't throw). `default` outside a provider.
 */
const useGenUICardLayout = (): GenUICardLayout => {
  const context = React.useContext(GenUIContext);
  return context?.cardLayout ?? 'default';
};

export {
  GenUIContext,
  useGenUI,
  useGenUIAction,
  useGenUIComponentActions,
  useGenUIAnimation,
  useGenUICardLayout,
};
export type { GenUIContextValue };
