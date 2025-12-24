/**
 * Utility classes module
 * Exports utility class names from CSS module for use in CVA definitions
 */
// @ts-expect-error - CSS modules may not have type definitions in build
import utilities from './utilities.module.css';

export const utilityClasses = utilities;

/**
 * Helper to get utility class name by key
 * Example: getUtilityClass('display-flex') -> returns the scoped class name
 */
export function getUtilityClass(key: keyof typeof utilities): string {
  return utilities[key];
}
