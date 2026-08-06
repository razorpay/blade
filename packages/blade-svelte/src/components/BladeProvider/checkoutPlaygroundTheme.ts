import { bladeTheme, createTheme } from '@razorpay/blade-core/tokens';
import type {
  ColorSchemeNamesInput,
  CreateThemeFontFamilyOverride,
  ThemeTokens,
} from '@razorpay/blade-core/tokens';

export const BRAND_PRESETS: { label: string; hex: string }[] = [
  { label: 'Razorpay', hex: '' },
  { label: 'ICICI', hex: '#EE681A' },
  { label: 'Axis', hex: '#83003D' },
  { label: 'SBI', hex: '#15A5EB' },
  { label: 'IDBI', hex: '#107259' },
  { label: 'BookMyShow', hex: '#F32951' },
  { label: 'Swiggy', hex: '#F86B15' },
  { label: 'Zomato', hex: '#CF2033' },
  { label: 'DSP', hex: '#19BEA2' },
  { label: 'Nykaa', hex: '#DF005D' },
];

export const DEFAULT_RADIUS = {
  '2xsmall': 2,
  xsmall: 4,
  small: 8,
  medium: 12,
  large: 16,
} as const;

export type RadiusKey = keyof typeof DEFAULT_RADIUS;

export const RADIUS_KEYS = Object.keys(DEFAULT_RADIUS) as RadiusKey[];

export const RADIUS_PRESETS: Record<string, Record<RadiusKey, number>> = {
  default: { ...DEFAULT_RADIUS },
  soft: { '2xsmall': 2, xsmall: 2, small: 4, medium: 8, large: 12 },
  round: { '2xsmall': 4, xsmall: 8, small: 16, medium: 24, large: 32 },
  sharp: { '2xsmall': 0, xsmall: 0, small: 0, medium: 0, large: 0 },
};

export const PAGE_BG_PRESETS: { label: string; color: string }[] = [
  { label: 'Default', color: '' },
  { label: 'Cool gray', color: '#eef2f6' },
  { label: 'Warm sand', color: '#f7f3ed' },
  { label: 'Mint wash', color: '#edf8f5' },
];

export const FONT_PRESETS: { label: string; family?: CreateThemeFontFamilyOverride }[] = [
  { label: 'Blade default' },
  {
    label: 'System UI',
    family: {
      text: 'system-ui, -apple-system, Segoe UI, sans-serif',
      heading: 'system-ui, -apple-system, Segoe UI, sans-serif',
      code: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    },
  },
  {
    label: 'Serif',
    family: {
      text: 'Georgia, Times New Roman, serif',
      heading: 'Georgia, Times New Roman, serif',
    },
  },
];

export const RAZORPAY_BRAND_FALLBACK = 'hsla(218, 89%, 51%, 1)';

export type ThemeControlState = {
  brandLabel: string;
  radiusPreset: string;
  radiusOverride: Record<RadiusKey, number> | null;
  colorScheme: ColorSchemeNamesInput;
  pageBgLabel: string;
  fontPresetLabel: string;
  fontSizeScaleFactor: string;
};

export function getBorderRadius(state: ThemeControlState): Record<RadiusKey, number> {
  return state.radiusOverride ?? RADIUS_PRESETS[state.radiusPreset] ?? { ...DEFAULT_RADIUS };
}

export function hasCustomRadius(borderRadius: Record<RadiusKey, number>): boolean {
  return RADIUS_KEYS.some((key) => borderRadius[key] !== DEFAULT_RADIUS[key]);
}

export function usesCreateTheme(state: ThemeControlState): boolean {
  const brandHex = BRAND_PRESETS.find((b) => b.label === state.brandLabel)?.hex ?? '';
  const borderRadius = getBorderRadius(state);
  const pageBackground = PAGE_BG_PRESETS.find((p) => p.label === state.pageBgLabel)?.color ?? '';
  const fontFamilyOverride = FONT_PRESETS.find((f) => f.label === state.fontPresetLabel)?.family;
  const fontSizeFactor = Number(state.fontSizeScaleFactor);

  return (
    Boolean(brandHex) ||
    hasCustomRadius(borderRadius) ||
    Boolean(pageBackground) ||
    Boolean(fontFamilyOverride) ||
    fontSizeFactor !== 1
  );
}

export type ThemeBundle = {
  themeTokens: ThemeTokens;
  fontFaceCSS?: string;
};

export function buildThemeBundle(state: ThemeControlState): ThemeBundle {
  if (!usesCreateTheme(state)) {
    return { themeTokens: bladeTheme };
  }

  const brandHex = BRAND_PRESETS.find((b) => b.label === state.brandLabel)?.hex ?? '';
  const borderRadius = getBorderRadius(state);
  const pageBackground = PAGE_BG_PRESETS.find((p) => p.label === state.pageBgLabel)?.color ?? '';
  const fontFamilyOverride = FONT_PRESETS.find((f) => f.label === state.fontPresetLabel)?.family;
  const fontSizeFactor = Number(state.fontSizeScaleFactor);
  const scaleFactor = fontSizeFactor !== 1 ? fontSizeFactor : undefined;

  const { theme, fontFaceCSS } = createTheme({
    brandColor: brandHex || RAZORPAY_BRAND_FALLBACK,
    borderRadius: hasCustomRadius(borderRadius) ? { ...borderRadius } : undefined,
    fontFamily: fontFamilyOverride,
    fontSizeScaleFactor: scaleFactor,
    surface: pageBackground ? { background: { page: pageBackground } } : undefined,
  });

  return { themeTokens: theme, fontFaceCSS };
}

export function buildUsageSnippet(state: ThemeControlState): string {
  const colorScheme = state.colorScheme;
  const schemeAttr = `colorScheme="${colorScheme}"`;

  if (!usesCreateTheme(state)) {
    return `<BladeProvider themeTokens={bladeTheme} ${schemeAttr}>
  ...
</BladeProvider>`;
  }

  const brandHex = BRAND_PRESETS.find((b) => b.label === state.brandLabel)?.hex ?? '';
  const borderRadius = getBorderRadius(state);
  const pageBackground = PAGE_BG_PRESETS.find((p) => p.label === state.pageBgLabel)?.color ?? '';
  const fontFamilyOverride = FONT_PRESETS.find((f) => f.label === state.fontPresetLabel)?.family;
  const fontSizeFactor = Number(state.fontSizeScaleFactor);

  const parts: string[] = [];
  parts.push(`brandColor: '${brandHex || RAZORPAY_BRAND_FALLBACK}'`);
  if (hasCustomRadius(borderRadius)) {
    parts.push(
      `borderRadius: { ${RADIUS_KEYS.map((key) => `${key}: ${borderRadius[key]}`).join(', ')} }`,
    );
  }
  if (fontFamilyOverride) {
    parts.push(`fontFamily: ${JSON.stringify(fontFamilyOverride)}`);
  }
  if (fontSizeFactor !== 1) {
    parts.push(`fontSizeScaleFactor: ${fontSizeFactor}`);
  }
  if (pageBackground) {
    parts.push(`surface: { background: { page: '${pageBackground}' } }`);
  }

  return `<BladeProvider themeTokens={createTheme({ ${parts.join(', ')} }).theme} ${schemeAttr}>
  ...
</BladeProvider>`;
}
