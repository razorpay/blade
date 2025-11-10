/**
 * Checks if a color token is a sequential color.
 * Sequential colors follow the pattern: data.background.sequential.{colorName}.{numericValue}
 * where numeric values are 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
 *
 * @param colorToken - The color token to check
 * @returns true if the color token is sequential, false otherwise
 *
 * @example
 * isSequentialColor('data.background.sequential.azure.500')
 * // Returns: true
 *
 * @example
 * isSequentialColor('data.background.categorical.azure.moderate')
 * // Returns: false
 */
export const isSequentialColor = (colorToken: string): boolean => {
  // Check if it matches the sequential color pattern
  const sequentialMatch = colorToken.match(/^data\.background\.sequential\.([^.]+)\.(\d+)$/);

  if (!sequentialMatch) {
    return false;
  }

  const [, , numericValue] = sequentialMatch;
  const numericValueInt = parseInt(numericValue, 10);

  // Valid sequential color numeric values: 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000
  const validSequentialValues = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

  return validSequentialValues.includes(numericValueInt);
};
