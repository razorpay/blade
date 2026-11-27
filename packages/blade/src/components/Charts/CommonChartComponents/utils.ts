import { MIN_WIDTH, MAX_WIDTH, PADDING_HORIZONTAL } from './tokens';
import type { Theme } from '~components/BladeProvider';

/**
 * Measures text width using the Canvas API, returning the pixel width and a
 * (possibly truncated) display string.
 *
 * @param options.fontSize    Override the default font size (theme.typography.fonts.size[50]).
 *                            SankeyChart uses size[75] for node labels.
 * @param options.fontWeight  Override the default font weight (theme.typography.fonts.weight.medium).
 *                            SankeyChart uses semibold/regular depending on label part.
 * @param options.skipPadding When true, returns the raw canvas pixel width without applying the
 *                            MIN_WIDTH floor or PADDING_HORIZONTAL addition. Use this when measuring
 *                            individual text segments for layout decisions (e.g. SankeyChart chip
 *                            wrapping) where the caller needs actual glyph widths, not padded chip widths.
 */
const calculateTextWidth = (
  text: string,
  theme: Theme,
  options?: { fontSize?: number; fontWeight?: number | string; skipPadding?: boolean },
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
    // skipPadding: skip the MIN_WIDTH floor and PADDING_HORIZONTAL addition.
    // Used by SankeyChart to measure individual text segments for layout decisions —
    // those callers need the raw canvas pixel width, not a padded chip width.
    if (options?.skipPadding) return { width: fullTextWidth, displayText: text };
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

  // skipPadding: return the raw measured width of the truncated string,
  // consistent with the non-truncated skipPadding path above.
  if (options?.skipPadding) {
    const truncatedWidth = context.measureText(truncatedText).width;
    return { width: truncatedWidth, displayText: truncatedText };
  }

  const finalWidth = Math.max(MIN_WIDTH, MAX_WIDTH);
  return { width: finalWidth, displayText: truncatedText };
};

let measureContext: CanvasRenderingContext2D | null | undefined;

/**
 * The width of a text in px, in the given CSS font. It uses one shared canvas. With no canvas, it
 * estimates 0.55 of the font size for each character.
 */
const measureTextWidth = (
  text: string,
  font: { size: number; weight: number | string; family: string },
): number => {
  if (measureContext === undefined) {
    measureContext =
      typeof document === 'undefined' ? null : document.createElement('canvas').getContext('2d');
  }
  if (!measureContext) return text.length * font.size * 0.55;
  measureContext.font = `${font.weight} ${font.size}px ${font.family}`;
  return measureContext.measureText(text).width;
};

/**
 * Cuts a name to `maxWidth`, with an ellipsis. The width is measured in `font`.
 */
const truncateToWidth = (
  text: string,
  maxWidth: number,
  font: { size: number; weight: number | string; family: string },
): string => {
  if (measureTextWidth(text, font) <= maxWidth) return text;
  const cut = (end: number): string => `${text.slice(0, end).trimEnd()}…`;
  // The cut text only grows as `end` grows, so a binary search finds the longest cut that fits
  // in log2(n) measures, not n. With no fit, it keeps one character, as before.
  let low = 1;
  let high = text.length;
  while (low < high) {
    const mid = Math.ceil((low + high) / 2);
    if (measureTextWidth(cut(mid), font) <= maxWidth) low = mid;
    else high = mid - 1;
  }
  return cut(low);
};

export { calculateTextWidth, measureTextWidth, truncateToWidth };
