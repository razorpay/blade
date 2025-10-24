/**
 * Simple chart data sanitization utility
 *
 * This utility safely sanitizes strings for use in chart data objects.
 * It removes problematic characters while preserving the essential content.
 *
 * @param input - The string to sanitize
 * @returns Sanitized string safe for chart data
 *
 * @example
 * // Basic sanitization
 * sanitizeChartData('Sales Data 2024')
 * // Returns: 'Sales Data 2024'
 *
 * @example
 * // Removes line breaks and tabs
 * sanitizeChartData('Sales\nData\t2024')
 * // Returns: 'Sales Data 2024'
 *
 * @example
 * // Handles null/undefined
 * sanitizeChartData(null)
 * // Returns: ''
 *
 * @example
 * // Removes HTML tags
 * sanitizeChartData('<b>Sales</b> Data')
 * // Returns: 'Sales Data'
 */
export const sanitizeString = (input: string | null | undefined): string => {
  // Handle null/undefined input
  if (input == null) {
    return '';
  }

  // Convert to string if not already
  const str = String(input);

  return str
    .trim() // Remove leading/trailing whitespace
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[\r\n\t]/g, '_') // Replace line breaks and tabs with underscores
    .replace(/\s+/g, ' ') // Normalize multiple spaces to single space
    .trim() // Trim again after processing
    .substring(0, 100); // Limit to reasonable length for chart labels
};
