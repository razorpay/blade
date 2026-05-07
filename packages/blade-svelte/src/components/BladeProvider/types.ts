import type {
  BackdropBlur,
  Border,
  Breakpoints,
  Motion,
  Spacing,
  Typography,
  Elevation,
  Colors,
  ThemeTokens,
} from '@razorpay/blade-core/tokens';

export type Theme = {
  name: ThemeTokens['name'];
  border: Border;
  backdropBlur: BackdropBlur;
  breakpoints: Breakpoints;
  colors: Colors;
  spacing: Spacing;
  motion: Motion;
  elevation: Elevation;
  typography: Typography;
};
