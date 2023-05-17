import type { ColorSchemeModes } from '../../theme/theme.d';
import type { Platform } from '~utils';

export type ShadowLevels = 'none' | 'lowRaised' | 'midRaised' | 'highRaised';

type ShadowStyles = Readonly<{
  elevation: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: {
    width: number; // x-axis
    height: number; // y-axis
  };
}>;

export type Shadows = Record<
  ShadowLevels,
  Platform.Select<{
    web: string;
    native: ShadowStyles;
  }>
>;

export type ShadowsWithColorModes = Record<ColorSchemeModes, Shadows>;
