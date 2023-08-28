import tinycolor from 'tinycolor2';
import { colors as globalColors, opacity } from '~tokens/global';
import type { ThemeTokens } from '~tokens/theme';
import { overrideTheme } from '~tokens/theme';

const generateColorPalette = (oldBaseColorString: string): string[] => {
  const oldBaseColor = tinycolor(oldBaseColorString);
  const palette = [oldBaseColor.toHexString()]; // Include the original color
  const baseColor = tinycolor(oldBaseColor.toHexString());
  const brightness = tinycolor(oldBaseColor).getBrightness();
  const lightnessFactor = brightness > 150 ? 3 : 6;
  const darknessFactor = brightness < 50 ? 3 : 5;
  if (!baseColor) return [];
  let currentColor = tinycolor(oldBaseColor.toHexString());

  // Generate shades lighter
  for (let i = 0; i < 6; i++) {
    currentColor = currentColor.brighten(lightnessFactor);
    palette.push(currentColor.toHexString());
  }

  currentColor = tinycolor(oldBaseColor.toHexString()); // Reset to the base color

  // Generate shades darker
  for (let i = 0; i < 4; i++) {
    currentColor = currentColor.darken(darknessFactor);
    palette.unshift(currentColor.toHexString()); // Add shades at the beginning of the palette
  }

  return palette.reverse();
};

export const modifyThemeByBrand = (existingTheme: ThemeTokens, brandColor: string): ThemeTokens => {
  const colorPalette = generateColorPalette(brandColor);

  const brandPrimaryColor = colorPalette[6];
  const brandPrimaryColorHSLObj = tinycolor(brandPrimaryColor).toHsl();

  const brandColors = {
    '300': colorPalette[3],
    '400': colorPalette[4],
    '500': colorPalette[5],
    '600': brandPrimaryColor,
    '700': colorPalette[7],
    '800': colorPalette[8],
    '900': colorPalette[9],
    '950': colorPalette[10],
    a00: `hsla(${brandPrimaryColorHSLObj.h}, ${brandPrimaryColorHSLObj.s * 100}%, ${
      brandPrimaryColorHSLObj.l * 100
    }%, ${opacity[0]})`,
    a50: `hsla(${brandPrimaryColorHSLObj.h}, ${brandPrimaryColorHSLObj.s * 100}%, ${
      brandPrimaryColorHSLObj.l * 100
    }%, ${opacity[1]})`,
    a100: `hsla(${brandPrimaryColorHSLObj.h}, ${brandPrimaryColorHSLObj.s * 100}%, ${
      brandPrimaryColorHSLObj.l * 100
    }%, ${opacity[2]})`,
    a200: `hsla(${brandPrimaryColorHSLObj.h}, ${brandPrimaryColorHSLObj.s * 100}%, ${
      brandPrimaryColorHSLObj.l * 100
    }%, ${opacity[3]})`,
  };

  const foregroundOnBrandColor = tinycolor
    .mostReadable(
      brandColors[700],
      [globalColors.neutral.blueGrayLight[1100], globalColors.neutral.blueGrayLight[50]],
      {
        level: 'AAA',
        size: 'large',
      },
    )
    .toHexString();

  const foregroundOnSurface = tinycolor.isReadable(
    globalColors.neutral.blueGrayLight[50],
    brandColors[600],
    {
      level: 'AAA',
      size: 'large',
    },
  )
    ? brandColors[600]
    : globalColors.neutral.blueGrayLight[1100];

  const brandedThemeTokens = overrideTheme({
    baseThemeTokens: existingTheme,
    overrides: {
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
                lowContrast: foregroundOnBrandColor,
              },
            },
            secondary: { 500: globalColors.chromatic.emerald[500] },
          },
          action: {
            background: {
              primary: {
                default: brandColors[600],
                hover: brandColors[700],
                focus: brandColors[800],
                active: brandColors[900],
                disabled: globalColors.neutral.blueGrayLight[300],
              },
              secondary: {
                default: brandColors.a00,
                hover: brandColors.a50,
                focus: brandColors.a100,
                active: brandColors.a200,
                disabled: globalColors.neutral.blueGrayLight.a00,
              },
              tertiary: {
                default: globalColors.neutral.blueGrayLight[0],
                hover: globalColors.neutral.blueGrayLight[50],
                focus: globalColors.neutral.blueGrayLight[100],
                active: globalColors.neutral.blueGrayLight[200],
                disabled: globalColors.neutral.blueGrayLight[0],
              },
            },
            border: {
              primary: {
                default: brandColors[600],
                hover: brandColors[700],
                focus: brandColors[800],
                active: brandColors[900],
                disabled: globalColors.neutral.blueGrayLight[300],
              },
              secondary: {
                default: brandColors[600],
                hover: brandColors[600],
                focus: brandColors[600],
                active: brandColors[600],
                disabled: globalColors.neutral.blueGrayLight[400],
              },
              tertiary: {
                default: globalColors.neutral.blueGrayLight[300],
                hover: globalColors.neutral.blueGrayLight[300],
                focus: globalColors.neutral.blueGrayLight[300],
                active: globalColors.neutral.blueGrayLight[300],
                disabled: globalColors.neutral.blueGrayLight[300],
              },
            },
            text: {
              primary: {
                default: foregroundOnBrandColor,
                hover: globalColors.neutral.blueGrayLight[0],
                focus: globalColors.neutral.blueGrayLight[0],
                active: globalColors.neutral.blueGrayLight[0],
                disabled: globalColors.neutral.blueGrayLight[600],
              },
              secondary: {
                default: foregroundOnSurface,
                hover: brandColors[600],
                focus: brandColors[600],
                active: brandColors[600],
                disabled: globalColors.neutral.blueGrayLight[400],
              },
            },
            icon: {
              primary: {
                default: foregroundOnBrandColor,
                hover: foregroundOnBrandColor,
                focus: foregroundOnBrandColor,
                active: foregroundOnBrandColor,
                disabled: globalColors.neutral.blueGrayLight[600],
              },
              secondary: {
                default: foregroundOnSurface,
                hover: foregroundOnSurface,
                focus: foregroundOnSurface,
                active: foregroundOnSurface,
                disabled: globalColors.neutral.blueGrayLight[400],
              },
              // tertiary: {
              //   default: globalColors.neutral.blueGrayLight[1000],
              //   hover: globalColors.neutral.blueGrayLight[1000],
              //   focus: globalColors.neutral.blueGrayLight[1000],
              //   active: globalColors.neutral.blueGrayLight[1000],
              //   disabled: globalColors.neutral.blueGrayLight[400],
              // },
              // link: {
              //   default: brandColors[600],
              //   hover: brandColors[700],
              //   focus: brandColors[800],
              //   active: brandColors[800],
              //   disabled: globalColors.neutral.blueGrayLight[400],
              //   visited: globalColors.chromatic.orchid[400],
              // },
            },
          },
        },
      },
    },
  });

  return brandedThemeTokens;
};
