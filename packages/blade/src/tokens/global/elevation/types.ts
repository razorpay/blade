import type { ColorSchemeModes } from '../../theme/theme.d';
import type { Platform } from '~utils';

export type ElevationLevels = 'none' | 'lowRaised' | 'midRaised' | 'highRaised';

type ElevationStyles = Readonly<{
  elevation: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: {
    width: number; // x-axis
    height: number; // y-axis
  };
}>;

export type Elevation = Record<
  ElevationLevels,
  Platform.Select<{
    web: string;
    native: ElevationStyles;
  }>
>;

export type ElevationWithColorModes = Record<ColorSchemeModes, Elevation>;
