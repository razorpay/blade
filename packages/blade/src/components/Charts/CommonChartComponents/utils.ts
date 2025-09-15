import { MIN_WIDTH, MAX_WIDTH, PADDING_HORIZONTAL } from './tokens';
import type { Theme } from '~components/BladeProvider';

const calculateTextWidth = (text: string, theme: Theme): { width: number; displayText: string } => {
  // Create a temporary canvas to measure text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return { width: 80, displayText: text }; // fallback

  // Set font properties to match the text styling
  const fontSize = theme.typography.fonts.size[50];
  const fontFamily = theme.typography.fonts.family.text;
  const fontWeight = theme.typography.fonts.weight.medium;

  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`;

  // Measure the full text first
  const fullTextWidth = context.measureText(text).width;
  const availableWidth = MAX_WIDTH - PADDING_HORIZONTAL;

  // If text fits within max width, use it as is
  if (fullTextWidth <= availableWidth) {
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
