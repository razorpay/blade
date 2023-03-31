/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

/**
 * Gets the `componentId` prop of React component if it exists.
 */
const getComponentId = (component: React.ReactNode): string | null => {
  if (!React.isValidElement(component)) return null;
  // eslint-disable-next-line no-restricted-properties
  return (component.type as any)?.componentId;
};

/**
 * Checks if the `component` matches the `componentId`
 */
const isValidAllowedChildren = (component: React.ReactNode, id: string): boolean => {
  return getComponentId(component) === id;
};

export { isValidAllowedChildren, getComponentId };
