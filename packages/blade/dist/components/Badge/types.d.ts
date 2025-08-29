import { BadgeProps } from './Badge';
import { Theme } from '../BladeProvider';
import { DotNotationColorStringToken } from '../../utils/types';
import { SubtleOrIntense } from '../../tokens/theme/theme';
type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;
type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<Theme['colors']['feedback']['background']>}`;
export type StyledBadgeProps = {
    backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
    size: NonNullable<BadgeProps['size']>;
    theme: Theme;
};
export {};
