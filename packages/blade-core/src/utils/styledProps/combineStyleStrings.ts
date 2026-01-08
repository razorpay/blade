/**
 * Combines multiple style strings into a single style string
 * Filters out empty strings and joins with semicolons
 *
 * @param styles - Array of style strings to combine
 * @returns Combined style string
 *
 * @example
 * ```ts
 * const combined = combineStyleStrings(
 *   'color: red',
 *   'margin: 10px',
 *   '' // empty strings are filtered out
 * );
 * // Returns: "color: red; margin: 10px"
 * ```
 */
export const combineStyleStrings = (...styles: (string | undefined | null)[]): string => {
  return styles.filter(Boolean).join('; ');
};
