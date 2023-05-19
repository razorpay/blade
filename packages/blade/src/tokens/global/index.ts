import { border } from './border';
import { breakpoints } from './breakpoints';
import { colors } from './colors';
import { opacity } from './opacity';
import { typography } from './typography';
import { spacing } from './spacing';
import { motion } from './motion';
import { size } from './size';
import { elevation } from './elevation';

export type { Border } from './border';
export type { Breakpoints } from './breakpoints';
export type { Color } from './colors';
export type { FontFamily } from './fontFamily';
export type { Opacity } from './opacity';
export type {
  Typography,
  TypographyWithPlatforms,
  FontSize,
  TypographyPlatforms,
} from './typography';
export type { Spacing } from './spacing';
export type {
  Motion,
  EasingFunctionFactory,
  DurationString,
  EasingString,
  DelayString,
} from './motion';
export type { Size } from './size';
export type { Elevation, ElevationWithColorModes } from './elevation';

export { border, breakpoints, colors, elevation, opacity, size, spacing, typography, motion };
