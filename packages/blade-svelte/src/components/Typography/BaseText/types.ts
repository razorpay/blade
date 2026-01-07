import type { Snippet } from 'svelte';
import type {
  AccessibilityProps,
  DotNotationToken,
  StyledPropsBlade,
} from '@razorpay/blade-core/utils';
import type { Theme } from '../../BladeProvider/types';

// Text color types - using DotNotationToken from blade-core, matching React implementation exactly
type InteractiveText = DotNotationToken<Theme['colors']['interactive']['text']>;
type SurfaceText = DotNotationToken<Theme['colors']['surface']['text']>;
type FeedbackText = DotNotationToken<Theme['colors']['feedback']['text']>;

export type TextColors =
  | `interactive.text.${InteractiveText}`
  | `surface.text.${SurfaceText}`
  | `feedback.text.${FeedbackText}`;

type As =
  | 'code'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'p'
  | 'span'
  | 'abbr'
  | 'q'
  | 'cite'
  | 'figcaption'
  | 'div'
  | 'label';

export type BaseTextProps = {
  id?: string;
  color?: TextColors | 'currentColor'; // currentColor is useful for letting text inherit color property from its container
  fontFamily?: keyof Theme['typography']['fonts']['family'];
  fontSize?: keyof Theme['typography']['fonts']['size'];
  fontWeight?: keyof Theme['typography']['fonts']['weight'];
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: 'line-through' | 'none' | 'underline';
  textTransform?:
    | 'none'
    | 'capitalize'
    | 'uppercase'
    | 'lowercase'
    | 'full-width'
    | 'full-size-kana';
  lineHeight?: keyof Theme['typography']['lineHeights'];
  letterSpacing?: keyof Theme['typography']['letterSpacings'];
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  opacity?: number;
  /**
   * Web only
   */
  as?: As;
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  truncateAfterLines?: number;
  className?: string;
  style?: string | Record<string, string | number>;
  children: Snippet | string;
  accessibilityProps?: Partial<AccessibilityProps>;
  /**
   * React Native only - not applicable for Svelte but kept for API consistency
   */
  numberOfLines?: number;
  componentName?: 'base-text' | 'text' | 'title' | 'heading' | 'code' | 'display';
  testID?: string;
  // Analytics attributes
  [key: `data-analytics-${string}`]: string;
} & StyledPropsBlade;

export type StyledBaseTextProps = Pick<
  BaseTextProps,
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'fontStyle'
  | 'textDecorationLine'
  | 'lineHeight'
  | 'letterSpacing'
  | 'as'
  | 'textAlign'
  | 'numberOfLines'
  | 'truncateAfterLines'
  | 'wordBreak'
  | 'opacity'
  | 'textTransform'
> & { theme: Theme };

export type BaseTextSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';

// CVA variant types for BaseText class generation
export type FontSizeVariant =
  | 25
  | 50
  | 75
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
  | 1100
  | undefined;

export type LineHeightVariant =
  | 0
  | 25
  | 50
  | 75
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000
  | 1100
  | undefined;

export type FontWeightVariant = 'regular' | 'medium' | 'semibold' | 'bold' | undefined;

export type FontFamilyVariant = 'text' | undefined;
