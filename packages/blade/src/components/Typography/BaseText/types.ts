import type { Theme } from '~components/BladeProvider';
import type { AccessibilityProps } from '~utils/makeAccessible/types';
import type { TestID } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

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
  | 'div';

export type BaseTextProps = {
  id?: string;
  color?: TextColors;
  fontFamily?: keyof Theme['typography']['fonts']['family'];
  fontSize?: keyof Theme['typography']['fonts']['size'];
  fontWeight?: keyof Theme['typography']['fonts']['weight'];
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: 'line-through' | 'none' | 'underline';
  lineHeight?: keyof Theme['typography']['lineHeights'];
  letterSpacing?: keyof Theme['typography']['letterSpacings'];
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word';
  /**
   * Web only
   */
  as?: As;
  textAlign?: 'center' | 'justify' | 'left' | 'right';
  truncateAfterLines?: number;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  accessibilityProps?: Partial<AccessibilityProps>;
  /**
   * React Native only
   */
  numberOfLines?: number;
  componentName?: 'base-text' | 'text' | 'title' | 'heading' | 'code' | 'display';
} & TestID &
  StyledPropsBlade;

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
> & { theme: Theme };

export type BaseTextSizes = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
