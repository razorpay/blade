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

export type {
  // Main types
  GenUIBaseComponent,
  // Utility types
  GenUICustomComponent,
  GenUIAction,
  GenUIComponentRenderer,
  GenUIComponentDefinition,
  GenUIComponentRegistry,
};
