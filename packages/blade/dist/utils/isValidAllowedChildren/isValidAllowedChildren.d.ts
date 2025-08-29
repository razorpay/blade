import { default as React } from 'react';
/**
 * Gets the `componentId` prop of React component if it exists.
 */
declare const getComponentId: (component: React.ReactNode) => string | null;
/**
 * Checks if the `component` matches the `componentId`
 */
declare const isValidAllowedChildren: (component: React.ReactNode, id: string) => boolean;
export { isValidAllowedChildren, getComponentId };
