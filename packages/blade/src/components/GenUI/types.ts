// Base component interface - all components extend this
type GenUIBaseComponent = {
  component?: string;
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

type GenUIAction = {
  type: string;
  eventName?: string;
  data?: Record<string, unknown>;
};

/**
 * Props passed to a registered action slot render prop.
 * GenUI hands the consumer the component instance's schema (`data`) and a ref to
 * its rendered DOM node (`componentRef`) so the consumer can implement behavior
 * like PNG capture or CSV export without GenUI owning the action UI.
 */
type GenUIActionSlotProps<T extends GenUIBaseComponent = GenUIBaseComponent> = {
  /** The component's schema / props */
  data: T;
  /** Ref to the DOM node wrapping the rendered component (read lazily via `.current`) */
  componentRef: React.RefObject<HTMLElement>;
  /** The component type this slot is registered against */
  componentType: string;
};

/**
 * Action slot render prop. Registered per component type via
 * `GenUIProvider config.componentActions`. Rendered by GenUI in a slot below the
 * component (outside the gradient ring for block-level components).
 *
 * This is a render prop (a function returning ReactNode), not a component type —
 * the consumer receives `data` / `componentRef` directly as arguments.
 *
 * @example
 * ```tsx
 * const tableActions: GenUIActionSlotRenderer<TableComponent> = ({ data, componentRef }) => (
 *   <Link onClick={() => exportCsv(data.rows)}>Download CSV</Link>
 * );
 * ```
 */
type GenUIActionSlotRenderer<T extends GenUIBaseComponent = GenUIBaseComponent> = (
  props: GenUIActionSlotProps<T>,
) => React.ReactNode;

/**
 * Registry mapping component type -> action slot render prop.
 * Registered via `GenUIProvider config.componentActions`.
 */
type GenUIComponentActionsRegistry = Record<string, GenUIActionSlotRenderer<GenUIBaseComponent>>;

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
  /** Optional: animation name */
  animation?: {
    /** 'gradient-ring-entry' wraps the component in an AnimatedGradientBorder */
    name: 'gradient-ring-entry' | (string & Record<never, never>);
  };
};

/**
 * Registry of all component renderers
 */
type GenUIComponentRegistry = Record<string, GenUIComponentDefinition>;

export type {
  // Main types
  GenUIBaseComponent,
  // Utility types
  GenUICustomComponent,
  GenUIAction,
  GenUIComponentRenderer,
  GenUIComponentDefinition,
  GenUIComponentRegistry,
  GenUIActionSlotProps,
  GenUIActionSlotRenderer,
  GenUIComponentActionsRegistry,
};
