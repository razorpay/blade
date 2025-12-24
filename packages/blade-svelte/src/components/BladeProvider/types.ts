import type {
  Border,
  Breakpoints,
  Motion,
  Spacing,
  Typography,
  Elevation,
} from '@razorpay/blade-core/tokens/global';
import type { Colors, ThemeTokens } from '@razorpay/blade-core/tokens/theme';

export type Theme = {
  name: ThemeTokens['name'];
  border: Border;
  breakpoints: Breakpoints;
  colors: Colors;
  spacing: Spacing;
  motion: Motion;
  elevation: Elevation;
  typography: Typography;
};
