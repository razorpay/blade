import tinycolor from 'tinycolor2';
import type { WCAG2Options, ColorInput } from 'tinycolor2';
import type { ThemeTokens } from './theme';
import overrideTheme from './overrideTheme';
import bladeTheme from './bladeTheme';
import { colors as globalColors, opacity } from '~tokens/global';
import type { ColorChromaticScale } from '~tokens/global/colors';
import { throwBladeError } from '~utils/logger';
import type { DeepPartial } from '~utils/isPartialMatchObjectKeys';

// WCAG2ContrastOptions are the options used to determine if a color is readable
const WCAG2ContrastOptions: WCAG2Options = {
  level: 'AAA',
  size: 'large',
};

/**
 * getColorWithOpacity
 * @param color - The color to add opacity to
 * @param opacity - The opacity to add to the color
 * @returns The color with the opacity added
 * @example
 * getColorWithOpacity('#fff', 0.5) // returns 'hsla(0, 0%, 100%, 0.5)'
 *
 **/
const getColorWithOpacity = (color: ColorInput, opacity: number): string => {
  return tinycolor(color).setAlpha(opacity).toHslString();
};

/**
 *
 * @description
 * Generates a chromatic color palette based on the base color passed in.
 * The base color is used to generate a palette of 11 colors, 5 shades lighter and 5 shades darker than the base color.
 * @param baseColorInput - The base color to generate the chromatic color palette from in hex, rgb, or hsl format
 * @returns Array of chromatic color palette
 */
const generateChromaticBrandColors = (baseColorInput: ColorInput): ColorChromaticScale => {
  const baseColor = tinycolor(baseColorInput);
  const baseColorHslString = baseColor.toHslString();
  if (__DEV__) {
    if (!baseColor.isValid()) {
      throwBladeError({
        message: 'Invalid brandColor passed',
        moduleName: 'createTheme',
      });
    }
  }

  const palette = [baseColorHslString]; // Include the original color
  const brightness = tinycolor(baseColor).getBrightness();
  // Determine how much to lighten or darken the colors depending on the brightness of the base color
  const lightnessFactor = brightness > 150 ? 3 : 6;
  const darknessFactor = brightness < 50 ? 3 : 5;

  let currentColor = baseColor;

  // Generate shades lighter
  for (let lightShadeIndex = 0; lightShadeIndex < 6; lightShadeIndex++) {
    currentColor = currentColor.brighten(lightnessFactor);
    palette.push(currentColor.toHslString());
  }

  currentColor = tinycolor(baseColorHslString); // Reset to the base color

  // Generate shades darker
  for (let darkShadeIndex = 0; darkShadeIndex < 4; darkShadeIndex++) {
    currentColor = currentColor.darken(darknessFactor);
    palette.unshift(currentColor.toHslString()); // Add shades at the beginning of the palette
  }

  const colorPalette = palette.reverse();
  const brandPrimaryColor = colorPalette[6];

  const brandColors: ColorChromaticScale = {
    '50': colorPalette[0],
    '100': colorPalette[1],
    '200': colorPalette[2],
    '300': colorPalette[3],
    '400': colorPalette[4],
    '500': colorPalette[5],
    '600': brandPrimaryColor,
    '700': colorPalette[7],
    '800': colorPalette[8],
    '900': colorPalette[9],
    '1000': colorPalette[10],
    a50: getColorWithOpacity(brandPrimaryColor, opacity[100]),
    a150: getColorWithOpacity(brandPrimaryColor, opacity[100]),
    a100: getColorWithOpacity(brandPrimaryColor, opacity[200]),
    a200: getColorWithOpacity(brandPrimaryColor, opacity[300]),
  };

  return brandColors;
};

/**
 *
 * @param brandColors - The brand colors to use to override the light theme
 * @description Returns overrides for the light theme with the brand colors passed in
 * @returns Overrides for the light theme with the custom brand colors
 */
const getOnLightOverrides = (
  brandColors: ColorChromaticScale,
): DeepPartial<ThemeTokens['colors']['onLight']> => {
  // Select the most readable color to use as the foreground color on top of surface color
  // For example: On Secondary Button where the background color is surface color, the text color should be either the brand color or dark color depending on which is more readable on top of that surface color
  const foregroundOnSurface = tinycolor.isReadable(
    globalColors.neutral.blueGrayLight[50],
    brandColors[600],
    WCAG2ContrastOptions,
  )
    ? brandColors[600]
    : globalColors.neutral.blueGrayLight[1100];

  const foregroundOnBrand = tinycolor
    .mostReadable(
      brandColors[900],
      [globalColors.neutral.white[500], globalColors.neutral.black[500]],
      WCAG2ContrastOptions,
    )
    .toHslString();

  // Overrides for the light theme with the brand colors passed in
  const lightThemeOverrides: DeepPartial<ThemeTokens['colors']['onLight']> = {
    interactive: {
      background: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
          fadedHighlighted: brandColors.a150,
        },
      },
      border: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
        },
      },
      text: {
        primary: {
          normal: foregroundOnSurface,
          disabled: foregroundOnSurface,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
      icon: {
        primary: {
          normal: foregroundOnSurface,
          disabled: foregroundOnSurface,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
    },
    surface: {
      background: {
        primary: {
          intense: brandColors[600],
          subtle: brandColors[200],
        },
      },
      icon: {
        primary: {
          normal: brandColors[600],
        },
      },
      text: {
        primary: {
          normal: brandColors[600],
        },
      },
    },
  };

  return lightThemeOverrides;
};

/**
 *
 * @param brandColors - The brand colors to use to override the dark theme
 * @description Returns overrides for the dark theme with the brand colors passed in
 * @returns Overrides for the dark theme with the custom brand colors
 */
const getOnDarkOverrides = (
  brandColors: ColorChromaticScale,
): DeepPartial<ThemeTokens['colors']['onDark']> => {
  // Select the most readable color to use as the foreground color on top of surface color
  // For example: On Secondary Button where the background color is surface color, the text color should be either the brand color or dark color depending on which is more readable on top of that surface color
  const foregroundOnSurface = tinycolor.isReadable(
    globalColors.neutral.blueGrayDark[1100],
    brandColors[400],
    WCAG2ContrastOptions,
  )
    ? brandColors[400]
    : globalColors.neutral.blueGrayDark[0];

  const foregroundOnBrand = tinycolor
    .mostReadable(
      brandColors[900],
      [globalColors.neutral.white[500], globalColors.neutral.black[500]],
      WCAG2ContrastOptions,
    )
    .toHslString();

  // Overrides for the dark theme with the brand colors passed in
  const darkThemeOverrides: DeepPartial<ThemeTokens['colors']['onDark']> = {
    interactive: {
      background: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
          fadedHighlighted: brandColors.a150,
        },
      },
      border: {
        primary: {
          default: brandColors[600],
          highlighted: brandColors[700],
          disabled: brandColors.a100,
          faded: brandColors.a100,
        },
      },
      text: {
        primary: {
          normal: foregroundOnSurface,
          disabled: foregroundOnSurface,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
      icon: {
        primary: {
          normal: foregroundOnSurface,
          disabled: foregroundOnSurface,
          muted: foregroundOnSurface,
          subtle: foregroundOnSurface,
        },
        onPrimary: {
          normal: foregroundOnBrand,
          disabled: foregroundOnBrand,
          muted: foregroundOnBrand,
          subtle: foregroundOnBrand,
        },
      },
    },
    surface: {
      background: {
        primary: {
          intense: brandColors[600],
          subtle: brandColors[200],
        },
      },
      icon: {
        primary: {
          normal: brandColors[600],
        },
      },
    },
  };

  return darkThemeOverrides;
};

/**
 * @param {Object} themeConfig - The brand color and overrides to apply to the theme
 * @param {string} themeConfig.brandColor - The brand color to use to generate the theme. Can be in hex, rgb, or hsl format.
 * @description
 * Creates a Blade Theme based on the custom brand color
 * @returns The Theme Tokens with the custom brand colors
 * @example
 * const { theme, brandColors } = createTheme({ brandColor: '#19BEA2'})
 **/
export const createTheme = ({
  brandColor,
}: {
  brandColor: ColorInput;
}): { theme: ThemeTokens; brandColors: ColorChromaticScale } => {
  const chromaticBrandColors = generateChromaticBrandColors(brandColor);
  // Get onLight overrides
  const brandedLightTheme = getOnLightOverrides(chromaticBrandColors);
  // Get onDark overrides
  const brandedDarkTheme = getOnDarkOverrides(chromaticBrandColors);
  // Override the payment theme with the brand colors
  const brandedThemeTokens = overrideTheme({
    baseThemeTokens: bladeTheme,
    overrides: {
      name: `custom-${tinycolor(brandColor).toHex()}`,
      colors: {
        onLight: {
          ...brandedLightTheme,
        },
        onDark: {
          ...brandedDarkTheme,
        },
      },
    },
  });

  return { theme: brandedThemeTokens, brandColors: chromaticBrandColors };
};
