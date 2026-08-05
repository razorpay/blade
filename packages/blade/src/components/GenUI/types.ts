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

type GenUIActionSlotProps<T extends GenUIBaseComponent = GenUIBaseComponent> = {
  data: T;
  componentRef: React.RefObject<HTMLDivElement>;
  componentType: string;
};

type GenUIActionSlotRenderer<T extends GenUIBaseComponent = GenUIBaseComponent> = (
  props: GenUIActionSlotProps<T>,
) => React.ReactNode;

/**
 * Component types that render as block-level elements (wrapped in the animated
 * gradient border) and therefore support consumer-registered action slots.
 * Custom components with `animation.name === 'gradient-ring-entry'` are also
 * block-level at runtime, but their names are open-ended so they can't be
 * included in this static union — cast the registry if you need them.
 */
type GenUIBlockLevelComponentType = 'CARD' | 'TABLE';

/**
 * Registry of consumer action slots, keyed by block-level component type.
 * Action slots only render for block-level components (CARD, TABLE, or custom
 * components with the gradient-ring-entry animation) — registering an action
 * for any other component type has no effect.
 */
type GenUIComponentActionsRegistry = Partial<
  Record<GenUIBlockLevelComponentType, GenUIActionSlotRenderer<GenUIBaseComponent>>
>;

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
  GenUIBlockLevelComponentType,
};
