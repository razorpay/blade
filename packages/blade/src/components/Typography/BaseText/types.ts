import type { Theme } from '~components/BladeProvider';
import type { AccessibilityProps } from '~src/utils/makeAccessible/types';
import type { DotNotationColorStringToken, TestID } from '~src/_helpers/types';
import type { Feedback } from '~tokens/theme/theme';

type FeedbackColors = `feedback.text.${DotNotationColorStringToken<
  Theme['colors']['feedback']['text']
>}`;
type FeedbackActionColors = `feedback.${Feedback}.action.text.${DotNotationColorStringToken<
  Theme['colors']['feedback'][Feedback]['action']['text']
>}`;
type SurfaceColors = `surface.text.${DotNotationColorStringToken<
  Theme['colors']['surface']['text']
>}`;
type ActionColors = `action.text.${DotNotationColorStringToken<Theme['colors']['action']['text']>}`;
type BadgeTextColors = `badge.text.${DotNotationColorStringToken<
  Theme['colors']['badge']['text']
>}`;

export type BaseTextProps = {
  id?: string;
  color?: ActionColors | FeedbackColors | SurfaceColors | FeedbackActionColors | BadgeTextColors;
  fontFamily?: keyof Theme['typography']['fonts']['family'];
  fontSize?: keyof Theme['typography']['fonts']['size'];
  fontWeight?: keyof Theme['typography']['fonts']['weight'];
  fontStyle?: 'italic' | 'normal';
  textDecorationLine?: 'line-through' | 'none' | 'underline';
  lineHeight?: keyof Theme['typography']['lineHeights'];
  /**
   * Web only
   */
  as?: 'code' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
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
  componentName?: 'text' | 'title' | 'heading' | 'code';
} & TestID;

export type StyledBaseTextProps = Pick<
  BaseTextProps,
  | 'color'
  | 'fontFamily'
  | 'fontSize'
  | 'fontWeight'
  | 'fontStyle'
  | 'textDecorationLine'
  | 'lineHeight'
  | 'as'
  | 'textAlign'
  | 'numberOfLines'
> & { theme: Theme };
