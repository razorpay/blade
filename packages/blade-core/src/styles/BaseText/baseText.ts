import { cva } from 'class-variance-authority';
import { kebabCase } from '~utils';

export type BaseTextVariants = {
  fontSize?: 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;
  lineHeight?: 0 | 25 | 50 | 75 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  fontFamily?: 'text' | 'heading';
  fontStyle?: 'normal' | 'italic';
  textDecorationLine?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  letterSpacing?: 25 | 50 | 100;
  numberOfLines?: number;
  color?: string;
  opacity?: number;
};

/**
 * CVA-based BaseText styles (Tailwind).
 *
 * `.blade-text-base` is a plugin class carrying the `:where()` zero-specificity margin reset so
 * styled-prop margins always win. `letterSpacing` defaults to 100 (was the `.base` letter-spacing),
 * which avoids a base↔variant conflict. `word-break` / `text-transform` use arbitrary values where
 * Tailwind's named utility sets a different property (e.g. `break-words` = overflow-wrap, not
 * word-break) so the migration stays byte-faithful. Color is applied dynamically in
 * `getBaseTextClasses` (safelisted `text-*` utilities).
 */
export const baseTextStyles = cva('blade-text-base p-spacing-0', {
  variants: {
    fontSize: {
      25: 'text-25',
      50: 'text-50',
      75: 'text-75',
      100: 'text-100',
      200: 'text-200',
      300: 'text-300',
      400: 'text-400',
      500: 'text-500',
      600: 'text-600',
      700: 'text-700',
      800: 'text-800',
      900: 'text-900',
      1000: 'text-1000',
      1100: 'text-1100',
    },
    lineHeight: {
      0: 'leading-0',
      25: 'leading-25',
      50: 'leading-50',
      75: 'leading-75',
      100: 'leading-100',
      200: 'leading-200',
      300: 'leading-300',
      400: 'leading-400',
      500: 'leading-500',
      600: 'leading-600',
      700: 'leading-700',
      800: 'leading-800',
      900: 'leading-900',
      1000: 'leading-1000',
      1100: 'leading-1100',
    },
    fontWeight: {
      regular: 'font-regular',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    },
    fontFamily: {
      text: 'font-text',
      heading: 'font-heading',
    },
    fontStyle: {
      normal: 'not-italic',
      italic: 'italic',
    },
    textDecorationLine: {
      none: 'no-underline',
      underline: 'underline',
      'line-through': 'line-through',
    },
    textAlign: {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    },
    textTransform: {
      none: 'normal-case',
      capitalize: 'capitalize',
      uppercase: 'uppercase',
      lowercase: 'lowercase',
      'full-width': '[text-transform:full-width]',
      'full-size-kana': '[text-transform:full-size-kana]',
    },
    wordBreak: {
      normal: '[word-break:normal]',
      'break-all': 'break-all',
      'keep-all': 'break-keep',
      'break-word': '[word-break:break-word]',
    },
    letterSpacing: {
      25: 'tracking-25',
      50: 'tracking-50',
      100: 'tracking-100',
    },
    // Color is handled dynamically in getBaseTextClasses (safelisted `text-*` utilities).
    opacity: {
      0: 'opacity-0',
      25: 'opacity-25',
      50: 'opacity-50',
      64: 'opacity-64',
      75: 'opacity-75',
      100: 'opacity-100',
    },
    numberOfLines: {
      1: 'line-clamp-[1]',
      2: 'line-clamp-[2]',
      3: 'line-clamp-[3]',
      4: 'line-clamp-[4]',
      5: 'line-clamp-[5]',
      6: 'line-clamp-[6]',
      7: 'line-clamp-[7]',
      8: 'line-clamp-[8]',
      9: 'line-clamp-[9]',
      10: 'line-clamp-[10]',
    },
  },
  defaultVariants: {
    fontSize: 200,
    lineHeight: 100,
    fontWeight: 'regular',
    fontFamily: 'text',
    fontStyle: 'normal',
    textDecorationLine: 'none',
    letterSpacing: 100,
  },
});

/**
 * Convert a color token to its Tailwind text-color utility.
 * Example: 'surface.text.gray.normal' -> 'text-surface-text-gray-normal'. These utilities are
 * runtime-composed (color is any token string), so the semantic set is covered by the safelist.
 */
function colorTokenToClassName(color: string): string | undefined {
  if (color === 'currentColor') {
    return 'text-current';
  }
  const withHyphens = color.replace(/\./g, '-');
  return `text-${kebabCase(withHyphens)}`;
}

/**
 * Generate all classes for BaseText component
 * This is the single source of truth for all BaseText styling
 * Everything is class-based - no data attributes or inline styles
 */
export function getBaseTextClasses(props: BaseTextVariants & { className?: string }): string {
  const { className, color, opacity, numberOfLines, ...cvaProps } = props;

  // Generate CVA classes
  const cvaVariants = {
    fontSize: cvaProps.fontSize,
    lineHeight: cvaProps.lineHeight,
    fontWeight: cvaProps.fontWeight,
    fontFamily: cvaProps.fontFamily,
    fontStyle: cvaProps.fontStyle,
    textDecorationLine: cvaProps.textDecorationLine,
    textAlign: cvaProps.textAlign,
    textTransform: cvaProps.textTransform,
    wordBreak: cvaProps.wordBreak,
    letterSpacing: cvaProps.letterSpacing,
    opacity:
      opacity !== undefined
        ? (Math.round(opacity * 100) as 0 | 25 | 50 | 64 | 75 | 100)
        : undefined,
    numberOfLines:
      numberOfLines !== undefined && numberOfLines >= 1 && numberOfLines <= 10
        ? (numberOfLines as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10)
        : undefined,
  };

  const classes = [
    baseTextStyles(cvaVariants),
    // Generate color class name dynamically
    color ? colorTokenToClassName(color) : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return classes;
}
