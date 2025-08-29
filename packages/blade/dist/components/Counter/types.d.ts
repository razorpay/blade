import { CounterProps } from './Counter';
import { Theme } from '../BladeProvider';
import { TypographyPlatforms } from '../../tokens/global';
import { DotNotationColorStringToken } from '../../utils/types';
import { SubtleOrIntense } from '../../tokens/theme/theme';
type FeedbackBackgroundColors = `feedback.background.${DotNotationColorStringToken<Theme['colors']['feedback']['background']>}`;
type SurfacePrimaryColors = `surface.background.primary.${SubtleOrIntense}`;
export type StyledCounterProps = {
    backgroundColor: FeedbackBackgroundColors | SurfacePrimaryColors;
    size: NonNullable<CounterProps['size']>;
    platform: TypographyPlatforms;
    theme: Theme;
};
export {};
