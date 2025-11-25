/**
 * Common utility to extract styled props and convert them to CSS classes
 * This eliminates repetition across components like BaseText and BaseLink
 */

import { getStyledProps } from './getStyledProps';
import { getStyledPropsClasses as convertStyledPropsToClasses } from './getStyledPropsClasses';

/**
 * Converts inline styles object to a style string
 * Handles camelCase to kebab-case conversion for CSS properties
 */
const inlineStylesToString = (styles: Record<string, string | number>): string => {
  if (Object.keys(styles).length === 0) return '';

  return Object.entries(styles)
    .map(([k, v]) => {
      // Convert camelCase to kebab-case for CSS properties
      const cssKey = k.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${v}`;
    })
    .join('; ');
};

/**
 * Extracts styled props from a props object and converts them to CSS classes and inline styles
 *
 * @param rest - The rest props object (usually from component props destructuring)
 * @param breakpoint - Optional breakpoint for responsive values (default: 'base')
 * @returns An object with class names string and inline styles string
 *
 * @example
 * ```ts
 * let { ...rest }: ComponentProps = $props();
 * const { classes, inlineStyles } = getStyledPropsClasses(rest);
 * // classes: "margin-x-spacing-3 display-flex"
 * // inlineStyles: "z-index: 10"
 * ```
 */
export const getStyledPropsClasses = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rest: Record<string, any>,
  breakpoint: 'base' | 'xs' | 's' | 'm' | 'l' | 'xl' = 'base',
): { classes: string; inlineStyles: string } => {
  // Extract styled props
  const styledProps = getStyledProps(rest);

  // Convert to classes and inline styles
  const { classes, inlineStyles: inlineStylesObj } = convertStyledPropsToClasses(styledProps, breakpoint);

  return {
    classes: classes.join(' '),
    inlineStyles: inlineStylesToString(inlineStylesObj),
  };
};

/**
 * Combines multiple style strings into a single style string
 * Filters out empty strings and joins with semicolons
 *
 * @param styles - Array of style strings to combine
 * @returns Combined style string
 *
 * @example
 * ```ts
 * const combined = combineStyleStrings([
 *   'color: red',
 *   'margin: 10px',
 *   '' // empty strings are filtered out
 * ]);
 * // Returns: "color: red; margin: 10px"
 * ```
 */
export const combineStyleStrings = (...styles: (string | undefined | null)[]): string => {
  return styles.filter(Boolean).join('; ');
};
