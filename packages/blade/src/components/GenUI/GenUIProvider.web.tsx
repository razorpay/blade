/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useMemo } from 'react';
import type { GenUIAction, GenUIComponentRegistry } from './types';
import { createBuiltInRegistry } from './GenUIComponents';
import { GenUIContext } from './GenUIContext';
import type { GenUIContextValue } from './GenUIContext';

/**
 * GenUI Provider configuration
 */
type GenUIConfig = {
  /** Custom component renderers to register (also overrides built-in if same key) */
  components?: GenUIComponentRegistry;
  /** Handler for action button clicks */
  onActionClick?: (action: GenUIAction) => void;
};

// ============================================================================
// PROVIDER
// ============================================================================

type GenUIProviderProps = {
  children: React.ReactNode;
  /** Configuration for the GenUI provider */
  config?: GenUIConfig;
};

/**
 * GenUI Provider - Wrap your app with this to use GenUI components
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GenUIProvider>
 *   <GenUISchemaRenderer components={components} />
 * </GenUIProvider>
 *
 * // With custom components
 * <GenUIProvider
 *   config={{
 *     components: {
 *       CUSTOM_WIDGET: {
 *         renderer: MyCustomWidget,
 *       },
 *     },
 *     onActionClick: (action) => console.log('Action:', action),
 *   }}
 * >
 *   <GenUISchemaRenderer components={components} />
 * </GenUIProvider>
 * ```
 */
const GenUIProvider = ({ children, config = {} }: GenUIProviderProps) => {
  const contextValue = useMemo<GenUIContextValue>(() => {
    // Merge built-in with custom components (custom overrides built-in if same key)
    const registry: GenUIComponentRegistry = {
      ...createBuiltInRegistry(),
      ...(config.components ?? {}),
    };

    return {
      registry,
      onActionClick: config.onActionClick,
      validComponentTypes: Object.keys(registry),
    };
  }, [config]);

  return <GenUIContext.Provider value={contextValue}>{children}</GenUIContext.Provider>;
};

export {
  // Provider
  GenUIProvider,
  GenUIContext,
};
