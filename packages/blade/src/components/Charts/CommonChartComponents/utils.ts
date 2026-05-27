import { MIN_WIDTH, MAX_WIDTH, PADDING_HORIZONTAL } from './tokens';
import type { Theme } from '~components/BladeProvider';

/**
 * Measures text width using the Canvas API, returning the pixel width and a
 * (possibly truncated) display string.
 *
 * @param options.fontSize   Override the default font size (theme.typography.fonts.size[50]).
 *                           SankeyChart uses size[75] for node labels.
 * @param options.fontWeight Override the default font weight (theme.typography.fonts.weight.medium).
 *                           SankeyChart uses semibold/regular depending on label part.
 */
const calculateTextWidth = (
  text: string,
  theme: Theme,
  options?: { fontSize?: number; fontWeight?: number | string; rawMeasure?: boolean },
): { width: number; displayText: string } => {
  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return { width: 80, displayText: text }; // fallback

  // Set font properties to match the text styling — callers can override both
  // fontSize and fontWeight for components that use different type ramps.
  const fontSize = options?.fontSize ?? theme.typography.fonts.size[50];
  const fontFamily = theme.typography.fonts.family.text;
  const fontWeight = options?.fontWeight ?? theme.typography.fonts.weight.medium;

  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  // Measure the full text first
  const fullTextWidth = context.measureText(text).width;
  const availableWidth = MAX_WIDTH - PADDING_HORIZONTAL;

  // If text fits within max width, use it as is
  if (fullTextWidth <= availableWidth) {
    // rawMeasure: skip the MIN_WIDTH floor and PADDING_HORIZONTAL addition.
    // Used by SankeyChart to measure individual text segments for layout decisions —
    // those callers need the raw canvas pixel width, not a padded chip width.
    if (options?.rawMeasure) return { width: fullTextWidth, displayText: text };
    const finalWidth = Math.max(MIN_WIDTH, fullTextWidth + PADDING_HORIZONTAL);
    return { width: finalWidth, displayText: text };
  }

  // Text is too long, need to truncate
  const ELLIPSIS = '...';
  const ellipsisWidth = context.measureText(ELLIPSIS).width;
  const maxTextWidth = availableWidth - ellipsisWidth;

  // Binary search to find the optimal truncation point
  let left = 0;
  let right = text.length;
  let bestFit = '';

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const testText = text.substring(0, mid);
    const testWidth = context.measureText(testText).width;

    if (testWidth <= maxTextWidth) {
      bestFit = testText;
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }

  const truncatedText = bestFit + ELLIPSIS;
  const finalWidth = Math.max(MIN_WIDTH, MAX_WIDTH);

  return { width: finalWidth, displayText: truncatedText };
};

export { calculateTextWidth };
