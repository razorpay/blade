/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useMemo } from 'react';
import type {
  GenUIAction,
  GenUICardLayout,
  GenUIComponentActionsRegistry,
  GenUIComponentRegistry,
} from './types';
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
  /**
   * Consumer-registered action UI, keyed by component type. When a component of a
   * registered type renders, GenUI renders the matching render prop in a slot below
   * the component and hands it the component's `data` and a `componentRef`.
   */
  componentActions?: GenUIComponentActionsRegistry;
  /**
   * How blocks inside a CARD are laid out. Opt-in: `default` keeps today's layout.
   *
   * `compact`:
   * - DIVIDER inside a CARD: 12px a side, the header divider included.
   * - Next to a DIVIDER, the divider's 12px is the only space. No margin, padding or row gap
   *   stacks on it.
   * - The last block in a CARD adds no space, so the card's 16px padding is the bottom edge.
   * - INFO_GROUP: label and value on one row, small text, values right-aligned.
   * - Long values (ids, emails, VPAs, URLs) in INFO_GROUP values, TABLE text cells and CARD
   *   titles stay on one line. They are cut in the middle when they do not fit. The full value
   *   shows in a tooltip, and a click copies it.
   * - GRID: no column is narrower than 120px, so tiles wrap in a narrow box.
   * - A CARD with a CHART and no TABLE: no divider under its header.
   * - TABLE as a direct child of a CARD: flush to the card's sides, clipped to its corners.
   *
   * @default 'default'
   */
  cardLayout?: GenUICardLayout;
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
 *
 * // With the compact card layout
 * <GenUIProvider config={{ cardLayout: 'compact' }}>
 *   <GenUISchemaRenderer components={components} />
 * </GenUIProvider>
 *
 * // With consumer-registered action slots (render prop gets the component's data + ref)
 * <GenUIProvider
 *   config={{
 *     componentActions: {
 *       TABLE: ({ data, componentRef }) => (
 *         <Link onClick={() => exportCsv(data.rows)}>Download CSV</Link>
 *       ),
 *       CARD: ({ componentRef }) => (
 *         <Link onClick={() => exportPng(componentRef.current)}>Download PNG</Link>
 *       ),
 *     },
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
      componentActions: config.componentActions,
      cardLayout: config.cardLayout,
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
