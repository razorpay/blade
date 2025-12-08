/**
 * Utility function to normalize dynamic IDs in snapshots for consistent testing.
 * This is particularly useful for chart components that use Recharts, which generates
 * dynamic IDs like "recharts73-clip" that change between test runs.
 */

/**
 * Normalizes dynamic IDs in HTML strings to make snapshots consistent.
 * Replaces patterns like:
 * - recharts[number]-clip -> recharts-clip
 * - recharts[number]-gradient -> recharts-gradient
 * - Any other recharts dynamic IDs
 */
export const normalizeSnapshotIds = (html: string): string => {
  return html
    .replace(/recharts\d+-/g, 'recharts-')
    .replace(/id="recharts-\d+"/g, 'id="recharts-clip"')
    .replace(/url\(#recharts-\d+\)/g, 'url(#recharts-clip)')
    .replace(/xlink:href="#recharts-\d+"/g, 'xlink:href="#recharts-clip"');
};
