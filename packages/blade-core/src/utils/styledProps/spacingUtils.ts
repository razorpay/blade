/**
 * Utilities for converting spacing values (tokens, pixels, etc.) to CSS values
 * Framework-agnostic utilities for handling spacing tokens
 */

/**
 * Checks if a value is a spacing token (e.g., "spacing.3")
 */
const isSpacingToken = (value: string): boolean => {
  return typeof value === 'string' && value.startsWith('spacing.');
};

/**
 * Converts spacing value to CSS value
 * Handles:
 * - Spacing tokens (e.g., "spacing.3") -> CSS variable (e.g., "var(--spacing-3)")
 * - Pixel values (e.g., "20px") -> as is
 * - Percentage values (e.g., "50%") -> as is
 * - "auto" -> as is
 * - Arrays -> joins with space
 */
export const getSpacingValue = (
  spacingValue: string | string[] | undefined,
): string | undefined => {
  if (spacingValue === undefined || spacingValue === null) {
    return undefined;
  }

  if (spacingValue === 'auto') {
    return spacingValue;
  }

  // Handle arrays (for margin shorthand: [top, right, bottom, left])
  if (Array.isArray(spacingValue)) {
    return spacingValue
      .map((value) => getSpacingValue(value))
      .filter(Boolean)
      .join(' ');
  }

  // Handle spacing tokens
  if (typeof spacingValue === 'string' && isSpacingToken(spacingValue)) {
    const tokenNumber = spacingValue.replace('spacing.', '');
    // Convert to CSS variable format: --spacing-3
    return `var(--spacing-${tokenNumber})`;
  }

  // Return pixel or other unit values as is
  return spacingValue;
};

