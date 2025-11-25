import type { BaseTextProps } from '../BaseText/types';
import type { CodeProps } from './types';

export function getCodeFontSizeAndLineHeight(
  size: CodeProps['size'] = 'small',
): { fontSize: keyof BaseTextProps['fontSize']; lineHeight: keyof BaseTextProps['lineHeight'] } {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75 };
    case 'small':
      return { fontSize: 25, lineHeight: 25 };
    default:
      return { fontSize: 25, lineHeight: 25 };
  }
}

export function getCodeColor({
  isHighlighted,
  color,
}: Pick<CodeProps, 'isHighlighted' | 'color'>): CodeProps['color'] {
  if (isHighlighted) {
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      if (color) {
        console.error('[Blade: Code]: `color` prop cannot be used without `isHighlighted={false}`');
      }
    }
    return 'surface.text.gray.subtle';
  }

  if (color) {
    return color;
  }

  return 'surface.text.gray.normal';
}

