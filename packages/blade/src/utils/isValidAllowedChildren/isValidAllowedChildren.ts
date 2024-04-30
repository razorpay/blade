/* eslint-disable no-restricted-properties */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

/**
 * Gets the `componentId` prop of React component if it exists.
 */
const getComponentId = (component: React.ReactNode): string | null => {
  if (!React.isValidElement(component)) return null;

  // Storybook wraps MDX components in a wrapper component, so we need to get componentId from originalType
  if (component?.props?.mdxType && component?.props?.originalType?.componentId) {
    return component.props.originalType.componentId;
  }
  return (component.type as any)?.componentId;
};

/**
 * Checks if the `component` matches the `componentId`
 */
const isValidAllowedChildren = (component: React.ReactNode, id: string): boolean => {
  return getComponentId(component) === id;
};

export { isValidAllowedChildren, getComponentId };
