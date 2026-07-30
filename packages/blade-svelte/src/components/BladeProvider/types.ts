import type { Snippet } from 'svelte';
import type { StyleOverride } from '@razorpay/blade-core/styles';
import type {
  ButtonSlot,
  IconButtonSlot,
  TextSlot,
  HeadingSlot,
  AmountSlot,
  AnnouncementBannerSlot,
  CardSlot,
  AppBarLeadingSlot,
  DividerSlot,
  AvatarSlot,
  AccordionSlot,
} from '@razorpay/blade-core/styles';
import type {
  BackdropBlur,
  Border,
  Breakpoints,
  Motion,
  Spacing,
  Typography,
  Elevation,
  TypographyPlatforms,
  Colors,
  ThemeTokens,
  ColorSchemeNames,
  ColorSchemeNamesInput,
} from '@razorpay/blade-core/tokens';

/**
 * Checkout-priority and commonly configured Blade components.
 * Slot unions per component live in blade-core; this registry keys provider config.
 */
export type BladeComponentName =
  | 'Button'
  | 'IconButton'
  | 'Text'
  | 'Heading'
  | 'Amount'
  | 'AnnouncementBanner'
  | 'Card'
  | 'AppBarLeading'
  | 'Divider'
  | 'Avatar'
  | 'Accordion';

/**
 * Maps each {@link BladeComponentName} to its per-component slot union.
 * Used by {@link BladeComponentConfigMap} to enforce correct slot keys in
 * provider `componentConfig`.
 */
export type ComponentSlots = {
  Button: ButtonSlot;
  IconButton: IconButtonSlot;
  Text: TextSlot;
  Heading: HeadingSlot;
  Amount: AmountSlot;
  AnnouncementBanner: AnnouncementBannerSlot;
  Card: CardSlot;
  AppBarLeading: AppBarLeadingSlot;
  Divider: DividerSlot;
  Avatar: AvatarSlot;
  Accordion: AccordionSlot;
};

export type BladeComponentConfig<Slot extends string = string> = {
  /**
   * Global slot → classname overrides for every instance of this component.
   * Instance `styleOverride` wins over provider config (see merge precedence below).
   */
  styleOverride?: StyleOverride<Slot>;
  /**
   * Reserved for Phase 4 — default prop bag per component (not implemented yet).
   */
  defaultProps?: Record<string, unknown>;
};

/**
 * Per-component config map keyed by {@link BladeComponentName}.
 * Each entry's `styleOverride` is constrained to that component's slot union,
 * so provider config rejects invalid slot names at compile time.
 */
export type BladeComponentConfigMap = {
  [Name in BladeComponentName]?: BladeComponentConfig<ComponentSlots[Name]>;
};

/**
 * Resolved (mode + platform flattened) theme used at runtime.
 */
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

export type BladeProviderProps = {
  /**
   * Theme token bag — pass `bladeTheme` or `createTheme({ brandColor }).theme`.
   */
  themeTokens: ThemeTokens;
  /**
   * Color scheme for this provider scope.
   * @default 'light'
   */
  colorScheme?: ColorSchemeNamesInput;
  /**
   * Per-component defaults applied to every instance under this provider.
   *
   * **Merge precedence (lowest → highest):**
   * 1. Base internal blade styles (CSS modules in `@layer blade`)
   * 2. `componentConfig[Name].styleOverride` from BladeProvider
   * 3. Instance `styleOverride` prop on the component
   *
   * Class conflicts are resolved by cascade layers — unlayered consumer classes beat
   * layered blade internals without `!important`.
   */
  componentConfig?: BladeComponentConfigMap;
  /**
   * Optional `@font-face` CSS from `createTheme({ fontFaces }).fontFaceCSS`.
   * Injected once on this provider scope before children render.
   */
  fontFaceCSS?: string;
  children: Snippet;
};

export type BladeThemeContextValue = {
  theme: Theme;
  themeTokens: ThemeTokens;
  colorScheme: ColorSchemeNames;
  setColorScheme: (colorScheme: ColorSchemeNamesInput) => void;
  platform: TypographyPlatforms;
  componentConfig?: BladeProviderProps['componentConfig'];
};
