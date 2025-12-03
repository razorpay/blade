import { cva } from 'class-variance-authority';
import { utilityClasses } from '../utilities';
// @ts-expect-error - CSS modules may not have type definitions in build
import styles from './baseText.module.css';
// @ts-expect-error - Module resolution issue, types exist but not resolved
import { kebabCase } from '@razorpay/blade-core/utils';

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
  letterSpacing?: 50 | 100;
  numberOfLines?: number;
  color?: string;
  opacity?: number;
};

export const baseTextStyles = cva(styles.base, {
  variants: {
    fontSize: {
      25: styles['font-size-25'],
      50: styles['font-size-50'],
      75: styles['font-size-75'],
      100: styles['font-size-100'],
      200: styles['font-size-200'],
      300: styles['font-size-300'],
      400: styles['font-size-400'],
      500: styles['font-size-500'],
      600: styles['font-size-600'],
      700: styles['font-size-700'],
      800: styles['font-size-800'],
      900: styles['font-size-900'],
      1000: styles['font-size-1000'],
      1100: styles['font-size-1100'],
    },
    lineHeight: {
      0: styles['line-height-0'],
      25: styles['line-height-25'],
      50: styles['line-height-50'],
      75: styles['line-height-75'],
      100: styles['line-height-100'],
      200: styles['line-height-200'],
      300: styles['line-height-300'],
      400: styles['line-height-400'],
      500: styles['line-height-500'],
      600: styles['line-height-600'],
      700: styles['line-height-700'],
      800: styles['line-height-800'],
      900: styles['line-height-900'],
      1000: styles['line-height-1000'],
      1100: styles['line-height-1100'],
    },
    fontWeight: {
      regular: styles['font-weight-regular'],
      medium: styles['font-weight-medium'],
      semibold: styles['font-weight-semibold'],
      bold: styles['font-weight-bold'],
    },
    fontFamily: {
      text: styles['font-family-text'],
      heading: styles['font-family-heading'],
    },
    fontStyle: {
      normal: styles['font-style-normal'],
      italic: styles['font-style-italic'],
    },
    textDecorationLine: {
      none: styles['text-decoration-none'],
      underline: styles['text-decoration-underline'],
      'line-through': styles['text-decoration-line-through'],
    },
    textAlign: {
      left: styles['text-align-left'],
      center: styles['text-align-center'],
      right: styles['text-align-right'],
      justify: styles['text-align-justify'],
    },
    textTransform: {
      none: styles['text-transform-none'],
      capitalize: styles['text-transform-capitalize'],
      uppercase: styles['text-transform-uppercase'],
      lowercase: styles['text-transform-lowercase'],
      'full-width': styles['text-transform-full-width'],
      'full-size-kana': styles['text-transform-full-size-kana'],
    },
    wordBreak: {
      normal: styles['word-break-normal'],
      'break-all': styles['word-break-break-all'],
      'keep-all': styles['word-break-keep-all'],
      'break-word': styles['word-break-break-word'],
    },
    letterSpacing: {
      50: styles['letter-spacing-50'],
      100: styles['letter-spacing-100'],
    },
    // Color is handled via compound variants - see getBaseTextClasses function
    opacity: {
      0: utilityClasses['opacity-0'],
      25: utilityClasses['opacity-25'],
      50: utilityClasses['opacity-50'],
      75: utilityClasses['opacity-75'],
      100: utilityClasses['opacity-100'],
    },
    numberOfLines: {
      1: utilityClasses['line-clamp-1'],
      2: utilityClasses['line-clamp-2'],
      3: utilityClasses['line-clamp-3'],
      4: utilityClasses['line-clamp-4'],
      5: utilityClasses['line-clamp-5'],
      6: utilityClasses['line-clamp-6'],
      7: utilityClasses['line-clamp-7'],
      8: utilityClasses['line-clamp-8'],
      9: utilityClasses['line-clamp-9'],
      10: utilityClasses['line-clamp-10'],
    },
  },
  defaultVariants: {
    fontSize: 200,
    lineHeight: 100,
    fontWeight: 'regular',
    fontFamily: 'text',
    fontStyle: 'normal',
    textDecorationLine: 'none',
  },
});

/**
 * Convert color token to CSS class name (scoped via CSS module)
 * Example: 'surface.text.gray.normal' -> utilityClasses['color-surface-text-gray-normal']
 */
function colorTokenToClassName(color: string): string | undefined {
  if (color === 'currentColor') {
    return utilityClasses['color-current'];
  }
  // Convert dot notation to kebab-case class name
  const withHyphens = color.replace(/\./g, '-');
  const className = `color-${kebabCase(withHyphens)}`;
  // Access the scoped class name from utility classes
  // Color classes are now in utilities.module.css
  return utilityClasses[className as keyof typeof utilityClasses];
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
      opacity !== undefined ? (Math.round(opacity * 100) as 0 | 25 | 50 | 75 | 100) : undefined,
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
