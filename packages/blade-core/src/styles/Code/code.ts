import { cva } from 'class-variance-authority';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './code.module.css';

export type CodeVariants = {
  isHighlighted?: boolean;
};

export type CodeSize = 'small' | 'medium';

// Font size and line height types matching BaseText
export type FontSize = 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;
export type LineHeight = 0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;

/**
 * Get Code font size and line height based on size prop
 * These values correspond to BaseText utility classes (font-size-25, font-size-75, etc.)
 * BaseText CVA will automatically convert these to the appropriate utility classes
 */
export function getCodeFontSizeAndLineHeight(
  size: CodeSize = 'small',
): { fontSize: FontSize; lineHeight: LineHeight } {
  switch (size) {
    case 'medium':
      return { fontSize: 75, lineHeight: 75 };
    case 'small':
      return { fontSize: 25, lineHeight: 25 };
    default:
      return { fontSize: 25, lineHeight: 25 };
  }
}

/**
 * Get Code color token based on isHighlighted and color props
 * Returns the color token string that BaseText CVA uses for colors
 */
export function getCodeColor({
  isHighlighted,
  color,
}: {
  isHighlighted: boolean;
  color?: string;
}): string {
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

export const codeStyles = cva(styles.base, {
  variants: {
    isHighlighted: {
      true: styles.highlighted,
      false: '',
    },
  },
  defaultVariants: {
    isHighlighted: true,
  },
});

/**
 * Generate all classes for Code component
 * This is the single source of truth for all Code styling
 */
export function getCodeClasses(props: CodeVariants & { className?: string }): string {
  const { className, ...cvaProps } = props;

  const classes = [
    codeStyles(cvaProps),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
}

