import tinycolor from 'tinycolor2';
import type { WCAG2Options, ColorInput } from 'tinycolor2';
import type { ThemeTokens } from './theme';
import overrideTheme from './overrideTheme';
import bankingTheme from './bankingTheme';
import paymentTheme from './paymentTheme';
import { colors as globalColors, opacity } from '~tokens/global';
import type { Color } from '~tokens/global';
import type { DeepPartial } from '~utils/isPartialMatchObjectKeys';
import { throwBladeError } from '~utils/logger';

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
 * @param baseColorInput - The base color to generate the chromatic color palette from in hex, rgb, or hsl format
 * @description
 * Generates a chromatic color palette based on the base color passed in.
 * The base color is used to generate a palette of 11 colors, 5 shades lighter and 5 shades darker than the base color.
 * @returns Array of chromatic color palette
 */
const generateChromaticBrandColors = (baseColorInput: ColorInput): Color['chromatic']['azure'] => {
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
  for (let i = 0; i < 6; i++) {
    currentColor = currentColor.brighten(lightnessFactor);
    palette.push(currentColor.toHslString());
  }

  currentColor = tinycolor(baseColorHslString); // Reset to the base color

  // Generate shades darker
  for (let i = 0; i < 4; i++) {
    currentColor = currentColor.darken(darknessFactor);
    palette.unshift(currentColor.toHslString()); // Add shades at the beginning of the palette
  }

  const colorPalette = palette.reverse();
  const brandPrimaryColor = colorPalette[6];

  const brandColors = {
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
    '950': colorPalette[10],
    a00: getColorWithOpacity(brandPrimaryColor, opacity[0]),
    a50: getColorWithOpacity(brandPrimaryColor, opacity[1]),
    a100: getColorWithOpacity(brandPrimaryColor, opacity[2]),
    a200: getColorWithOpacity(brandPrimaryColor, opacity[3]),
  };

  return brandColors;
};

/**
 *
 * @param brandColors - The brand colors to use to override the payment theme
 * @description Overrides the payment theme with the brand colors passed in
 * @returns The light theme tokens with the custom brand colors
 */
const getLightTheme = (brandColors: Color['chromatic']['azure']): ThemeTokens => {
  // Select the most readable color to use as the foreground color on top of brand color
  // For example: On Primary Button where the background color is brand color, the text color should be either dark or light depending on which is more readable on top of that brand color
  const foregroundOnBrandColorPaymentLight = tinycolor
    .mostReadable(
      brandColors[900],
      [globalColors.neutral.blueGrayLight[1100], globalColors.neutral.blueGrayLight[50]],
      WCAG2ContrastOptions,
    )
    .toHexString();

  // Select the most readable color to use as the foreground color on top of surface color
  // For example: On Secondary Button where the background color is surface color, the text color should be either the brand color or dark color depending on which is more readable on top of that surface color
  const foregroundOnSurfacePaymentLight = tinycolor.isReadable(
    globalColors.neutral.blueGrayLight[50],
    brandColors[600],
    WCAG2ContrastOptions,
  )
    ? brandColors[600]
    : globalColors.neutral.blueGrayLight[1100];

  // Override the payment theme onLight with the brand colors
  const lightThemePaymentsOverrides = {
    colors: {
      onLight: {
        brand: {
          primary: {
            300: brandColors.a50,
            400: brandColors.a100,
            500: brandColors[600],
            600: brandColors[700],
            700: brandColors[800],
            800: brandColors[950],
          },
          gray: {
            200: {
              lowContrast: foregroundOnBrandColorPaymentLight,
            },
          },
        },
        action: {
          background: {
            primary: {
              default: brandColors[600],
              hover: brandColors[700],
              focus: brandColors[800],
              active: brandColors[900],
            },
            secondary: {
              default: brandColors.a00,
              hover: brandColors.a50,
              focus: brandColors.a100,
              active: brandColors.a200,
            },
            tertiary: {
              default: globalColors.neutral.blueGrayLight[0],
              hover: globalColors.neutral.blueGrayLight[50],
              focus: globalColors.neutral.blueGrayLight[100],
              active: globalColors.neutral.blueGrayLight[200],
            },
          },
          border: {
            primary: {
              default: brandColors[600],
              hover: brandColors[700],
              focus: brandColors[800],
              active: brandColors[900],
            },
            secondary: {
              default: brandColors[600],
              hover: brandColors[600],
              focus: brandColors[600],
              active: brandColors[600],
            },
            tertiary: {
              default: globalColors.neutral.blueGrayLight[300],
              hover: globalColors.neutral.blueGrayLight[300],
              focus: globalColors.neutral.blueGrayLight[300],
              active: globalColors.neutral.blueGrayLight[300],
            },
          },
          text: {
            primary: {
              default: foregroundOnBrandColorPaymentLight,
              hover: foregroundOnBrandColorPaymentLight,
              focus: foregroundOnBrandColorPaymentLight,
              active: foregroundOnBrandColorPaymentLight,
            },
            secondary: {
              default: foregroundOnSurfacePaymentLight,
              hover: foregroundOnSurfacePaymentLight,
              focus: foregroundOnSurfacePaymentLight,
              active: foregroundOnSurfacePaymentLight,
            },
          },
          icon: {
            primary: {
              default: foregroundOnBrandColorPaymentLight,
              hover: foregroundOnBrandColorPaymentLight,
              focus: foregroundOnBrandColorPaymentLight,
              active: foregroundOnBrandColorPaymentLight,
            },
            secondary: {
              default: foregroundOnSurfacePaymentLight,
              hover: foregroundOnSurfacePaymentLight,
              focus: foregroundOnSurfacePaymentLight,
              active: foregroundOnSurfacePaymentLight,
            },
          },
        },
      },
    },
  };

  return overrideTheme({
    baseThemeTokens: paymentTheme,
    overrides: lightThemePaymentsOverrides,
  });
};

/**
 *
 * @param brandColors - The brand colors to use to override the banking theme
 * @description Overrides the banking theme with the brand colors passed in
 * @returns The dark theme tokens with the custom brand colors
 */
const getDarkTheme = (brandColors: Color['chromatic']['azure']): ThemeTokens => {
  // Select the most readable color to use as the foreground color on top of brand color
  // For example: On Primary Button where the background color is brand color, the text color should be either dark or light depending on which is more readable on top of that brand color
  const foregroundOnBrandColorBankingDark = tinycolor
    .mostReadable(
      brandColors[800],
      [globalColors.neutral.navyGrayDark[800], globalColors.neutral.navyGrayDark[0]],
      WCAG2ContrastOptions,
    )
    .toHexString();

  // Select the most readable color to use as the foreground color on top of surface color
  // For example: On Secondary Button where the background color is surface color, the text color should be either the brand color or light color depending on which is more readable on top of that surface color
  const foregroundOnSurfaceBankingDark = tinycolor.isReadable(
    globalColors.neutral.navyGrayDark[1100],
    brandColors[400],
    WCAG2ContrastOptions,
  )
    ? brandColors[400]
    : globalColors.neutral.navyGrayDark[0];

  // Override the banking theme onDark with the brand colors
  const darkThemeBankingOverrides = {
    colors: {
      onDark: {
        brand: {
          primary: {
            300: brandColors.a100,
            400: brandColors.a200,
            500: brandColors[400],
            600: brandColors[500],
            700: brandColors[600],
            800: brandColors[900],
          },
          gray: {
            200: {
              lowContrast: foregroundOnBrandColorBankingDark,
            },
          },
        },
        action: {
          background: {
            primary: {
              default: brandColors[500],
              hover: brandColors[600],
              focus: brandColors[700],
              active: brandColors[800],
            },
            secondary: {
              default: brandColors.a00,
              hover: brandColors.a50,
              focus: brandColors.a100,
              active: brandColors.a200,
            },
          },
          border: {
            primary: {
              default: brandColors[500],
              hover: brandColors[600],
              focus: brandColors[700],
              active: brandColors[800],
            },
            secondary: {
              default: brandColors[400],
              hover: brandColors[400],
              focus: brandColors[400],
              active: brandColors[400],
            },
          },
          text: {
            primary: {
              default: foregroundOnBrandColorBankingDark,
              hover: foregroundOnBrandColorBankingDark,
              focus: foregroundOnBrandColorBankingDark,
              active: foregroundOnBrandColorBankingDark,
            },
            secondary: {
              default: foregroundOnSurfaceBankingDark,
              hover: foregroundOnSurfaceBankingDark,
              focus: foregroundOnSurfaceBankingDark,
              active: foregroundOnSurfaceBankingDark,
            },
          },
          icon: {
            primary: {
              default: foregroundOnBrandColorBankingDark,
              hover: foregroundOnBrandColorBankingDark,
              focus: foregroundOnBrandColorBankingDark,
              active: foregroundOnBrandColorBankingDark,
            },
            secondary: {
              default: foregroundOnSurfaceBankingDark,
              hover: foregroundOnSurfaceBankingDark,
              focus: foregroundOnSurfaceBankingDark,
              active: foregroundOnSurfaceBankingDark,
            },
          },
        },
      },
    },
  };

  return overrideTheme({
    baseThemeTokens: bankingTheme,
    overrides: darkThemeBankingOverrides,
  });
};

/**
 * @param {Object} themeConfig - The brand color and overrides to apply to the theme
 * @param {string} themeConfig.brandColor - The brand color to use to generate the theme. Can be in hex, rgb, or hsl format.
 * @description
 * Creates a Blade Theme based on the custom brand color and overrides passed in
 * @returns The Theme Tokens with the custom brand colors and overrides applied
 * @example
 * const theme = createTheme({ brandColor: '#19BEA2', overrides: {} })
 **/
export const createTheme = ({
  brandColor,
  overrides: extraOverrides = {},
}: {
  brandColor: ColorInput;
  overrides?: DeepPartial<ThemeTokens>;
}): ThemeTokens => {
  const chromaticBrandColors = generateChromaticBrandColors(brandColor);
  // Get theme tokens for overriding onLight colors which are based on payment theme
  const brandedLightTheme = getLightTheme(chromaticBrandColors);
  // Get theme tokens for overriding onDark colors which are based on banking theme
  const brandedDarkTheme = getDarkTheme(chromaticBrandColors);

  // Merge theme with light colors from payment theme and dark colors from banking theme
  const brandedThemeTokens = overrideTheme({
    baseThemeTokens: paymentTheme,
    overrides: {
      name: `custom-${tinycolor(brandColor).toHex()}`,
      colors: {
        onLight: {
          ...brandedLightTheme.colors.onLight,
        },
        onDark: {
          ...brandedDarkTheme.colors.onDark,
        },
      },
      ...extraOverrides, // Apply any extra overrides passed in by the consumer
    },
  });

  return brandedThemeTokens;
};
