import React, { memo } from 'react';
import { Text } from '..';
import { useGenUI } from './GenUIProvider';
import { GenUIComponent } from './GenUIComponents';

/**
 * Helper to generate a stable key for a component based on its index and type
 */
const getComponentKey = (component: GenUIComponent, index: number): string => {
  if (!component || !component.component) {
    return `empty-${index}`;
  }
  return `${component.component}-${index}`;
};

type ComponentRendererProps = {
  /** The component schema to render */
  component?: GenUIComponent;
  /** Index of the component in the list */
  index: number;
};

/**
 * Internal component that renders a single GenUI component based on its schema
 * Must be used within a GenUIProvider
 */
const ComponentRenderer = memo(({ component, index }: ComponentRendererProps) => {
  const { registry, validComponentTypes } = useGenUI();

  // Handle incomplete components during streaming
  if (!component?.component) {
    return null;
  }

  const componentType = component.component;
  const key = getComponentKey(component, index);

  // Look up the renderer in the registry
  const definition = registry[componentType];

  if (definition) {
    const Renderer = definition.renderer;
    return <Renderer key={key} {...component} index={index} />;
  }

  // During streaming, we might get partial component names, ie DIV for DIVIDER or ST for STACK
  // Check if the current component name is a prefix of any valid component name
  const isPotentiallyValidComponentName = validComponentTypes.some((validName) =>
    validName.startsWith(componentType),
  );

  if (isPotentiallyValidComponentName) {
    return null;
  }

  return (
    <Text key={key} color="feedback.text.notice.intense">
      Unsupported component: {componentType}
    </Text>
  );
});

type GenUISchemaRendererProps = {
  /** The components array to render */
  components?: GenUIComponent[];
};

/**
 * Renders an array of GenUI components
 * Must be used within a GenUIProvider
 *
 * @example
 * ```tsx
 * <GenUIProvider>
 *   <GenUISchemaRenderer components={[...]} />
 * </GenUIProvider>
 * ```
 */
const GenUISchemaRenderer = memo(({ components }: GenUISchemaRendererProps) => {
  if (!components || components.length === 0) {
    return null;
  }

  return (
    <>
      {components.map((component, index) => (
        <ComponentRenderer
          key={getComponentKey(component, index)}
          component={component}
          index={index}
        />
      ))}
    </>
  );
});

export { GenUISchemaRenderer, ComponentRenderer };
export type { GenUISchemaRendererProps };
