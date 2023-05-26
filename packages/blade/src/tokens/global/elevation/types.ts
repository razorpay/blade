import type { ColorSchemeModes } from '../../theme/theme';
import type { Platform } from '~utils';

export type ElevationLevels = 'none' | 'lowRaised' | 'midRaised' | 'highRaised';

type ElevationStyles = Readonly<{
  elevation: number;
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: {
    /**
     * x-axis
     */
    width: number;
    /**
     * y-axis
     */
    height: number;
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
