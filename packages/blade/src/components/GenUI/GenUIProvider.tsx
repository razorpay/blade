import React, { createContext, useContext, useMemo } from 'react';
import { GenUIBaseComponent, createBuiltInRegistry } from './GenUIComponents';

/**
 * Component renderer function type
 */
type GenUIComponentRenderer<
  T extends GenUIBaseComponent = GenUIBaseComponent
> = React.ComponentType<T & { index: number }>;

/**
 * Component definition for registration
 */
type GenUIComponentDefinition<T extends GenUIBaseComponent = GenUIBaseComponent> = {
  /** The renderer component */
  renderer: GenUIComponentRenderer<T>;
  /** Optional: validate if the component name is a valid partial (for streaming) */
  isValidPartial?: (partialName: string) => boolean;
};

/**
 * Registry of all component renderers
 */
type GenUIComponentRegistry = Record<string, GenUIComponentDefinition>;

type GenUIAction = {
  type: string;
  eventName?: string;
  data?: Record<string, unknown>;
};
/**
 * GenUI Provider configuration
 */
type GenUIConfig = {
  /** Custom component renderers to register (also overrides built-in if same key) */
  components?: GenUIComponentRegistry;
  /** Handler for action button clicks */
  onActionClick?: (action: GenUIAction) => void;
};

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

/**
 * Type helper to create a custom component type
 *
 * @example
 * ```tsx
 * type MyWidgetComponent = CustomComponent<'MY_WIDGET', {
 *   title: string;
 *   data: number[];
 * }>;
 * ```
 */
type GenUICustomComponent<
  TName extends string,
  TProps extends Record<string, unknown>
> = GenUIBaseComponent & { component: TName } & TProps;

const GenUIContext = createContext<GenUIContextValue | null>(null);

/**
 * Hook to access GenUI context
 * @throws Error if used outside GenUIProvider
 */
const useGenUI = (): GenUIContextValue => {
  const context = useContext(GenUIContext);
  if (!context) {
    throw new Error('useGenUI must be used within a GenUIProvider');
  }
  return context;
};

/**
 * Hook to access action click handler (safe version that doesn't throw)
 */
const useGenUIAction = (): ((action: GenUIAction) => void) | undefined => {
  const context = useContext(GenUIContext);
  return context?.onActionClick;
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
      ...(config.components || {}),
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
  // Hooks
  useGenUI,
  useGenUIAction,
};

export type {
  // Main types
  GenUIConfig,
  GenUIContextValue,
  GenUIComponentRegistry,
  GenUIComponentDefinition,
  GenUIComponentRenderer,
  // Utility types
  GenUICustomComponent,
  GenUIAction,
};
