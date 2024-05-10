import type { Theme } from '~components/BladeProvider';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import type { DotNotationToken } from '~utils/lodashButBetter/get';

type InteractiveText = DotNotationToken<Theme['colors']['interactive']['icon']>;
type FeedbackText = DotNotationToken<Theme['colors']['feedback']['icon']>;
type SurfaceText = DotNotationToken<Theme['colors']['surface']['icon']>;
export type IconColors =
  | `interactive.icon.${InteractiveText}`
  | `surface.icon.${SurfaceText}`
  | `feedback.icon.${FeedbackText}`;

export type IconSize = 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | '2xlarge';
export type IconProps = {
  /**
   * Color token (not to be confused with actual hsla value)
   */
  color?: IconColors | 'currentColor'; // currentColor is useful for letting the SVG inherit color property from its container
  size?: IconSize;
} & StyledPropsBlade;
export type IconComponent = React.ComponentType<IconProps>;
