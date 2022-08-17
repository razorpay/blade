/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { isReadable } from 'tinycolor2';
import { BladeProvider } from '~components/BladeProvider';
import Box from '~components/Box';
import { Button } from '~components/Button';
import { Checkbox, CheckboxGroup } from '~components/Checkbox';
import { colors } from '~tokens/global';
import { ColorChromaticScale, ColorNeutralScale } from '~tokens/global/colors';
import { overrideTheme, paymentTheme } from '~tokens/theme';
import { getPaymentTheme } from '~tokens/theme/paymentTheme';
import { darken, lighten, shade, tint } from './colorUtils';

const generateChromaticPalette = (baseColor: string): ColorChromaticScale => {
  return {
    50: baseColor,
    100: darken(baseColor, 0.201),
    200: darken(baseColor, 0.202),
    300: darken(baseColor, 0.203),
    400: darken(baseColor, 0.204),
    500: darken(baseColor, 0.205),
    600: darken(baseColor, 0.206),
    700: darken(baseColor, 0.207),
    800: darken(baseColor, 0.208),
    900: darken(baseColor, 0.209),
    950: darken(baseColor, 0.21),
    a00: darken(lighten(baseColor, 0.0), 0.01),
    a50: darken(lighten(baseColor, 0.0), 0.02),
    a100: darken(lighten(baseColor, 0.0), 0.03),
    a200: darken(lighten(baseColor, 0.0), 0.04),
  };
};

const generateNeutralPalette = (baseColor: string): ColorNeutralScale => {
  return {
    0: baseColor,
    50: darken(baseColor, 0.301),
    100: darken(baseColor, 0.302),
    200: darken(baseColor, 0.303),
    300: darken(baseColor, 0.304),
    400: darken(baseColor, 0.305),
    500: darken(baseColor, 0.306),
    600: darken(baseColor, 0.307),
    700: darken(baseColor, 0.308),
    800: darken(baseColor, 0.31),
    900: darken(baseColor, 0.311),
    1000: darken(baseColor, 0.312),
    1100: darken(baseColor, 0.313),
    1200: darken(baseColor, 0.314),
    1300: darken(baseColor, 0.315),
    a00: darken(lighten(baseColor, 0.1), 0.01),
    a50: darken(lighten(baseColor, 0.1), 0.02),
    a100: darken(lighten(baseColor, 0.1), 0.03),
    a200: darken(lighten(baseColor, 0.1), 0.04),
  };
};

const customTheme = overrideTheme({
  baseThemeTokens: paymentTheme,
  overrides: {
    ...getPaymentTheme({
      chromatic: {
        azure: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
        emerald: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
        crimson: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
        cider: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
        orchid: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
        magenta: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
        sapphire: generateChromaticPalette('hsla(38, 100%, 50%, 1)'),
      },
      neutral: {
        blueGrayLight: generateNeutralPalette('hsla(38, 100%, 50%, 1)'),
        blueGrayDark: generateNeutralPalette('hsla(38, 100%, 50%, 1)'),
        navyGrayLight: generateNeutralPalette('hsla(38, 100%, 50%, 1)'),
        navyGrayDark: generateNeutralPalette('hsla(38, 100%, 50%, 1)'),
        ashGrayLight: generateNeutralPalette('hsla(38, 100%, 50%, 1)'),
        ashGrayDark: generateNeutralPalette('hsla(38, 100%, 50%, 1)'),
      },
    }),
    // brand: {
    //   ...generateBrandColors('hsla(89, 100%, 45%, 1)'),
    // },
    // action: {
    // background: {
    //   ...generateActionVariants('hsla(89, 100%, 45%, 1)'),
    // },
    // border: {
    //   ...generateActionVariants('hsla(89, 100%, 45%, 1)'),
    // },
    // text: {
    //   ...generateTextActionVariants('hsla(89, 100%, 45%, 1)'),
    // },
  },
});

const OverrideTheme = (): React.ReactElement => {
  return (
    <BladeProvider themeTokens={customTheme}>
      <Box display="flex" gap="spacing.2">
        <Button size="small" variant="primary">
          Primary
        </Button>
        <Button size="small" variant="secondary">
          Secondary
        </Button>
        <Button size="small" variant="tertiary">
          Tertiary
        </Button>
      </Box>
      <br />
      <CheckboxGroup label="Checkbox group">
        <Checkbox value="a">Blade</Checkbox>
        <Checkbox value="b">MUI</Checkbox>
        <Checkbox value="c">Chakra</Checkbox>
      </CheckboxGroup>
    </BladeProvider>
  );
};

export { OverrideTheme };

// ATTEMPT WHERE I TRIED TO GENERATE THE THEME COLORS
// const generateActionColors = (baseColor: string) => {
//   const _default = baseColor;
//   const hoverBase = darken(baseColor, 0.1);
//   const focusBase = darken(baseColor, 0.1);
//   const activeBase = darken(baseColor, 0.3);

//   return {
//     default: _default,
//     hover: hoverBase,
//     focus: focusBase,
//     active: activeBase,
//   };
// };

// const generateActionVariants = (value: string) => {
//   const primary = generateActionColors(value);
//   const secondary = generateActionColors(lighten(value, 0.05));
//   const tertiary = generateActionColors(lighten(value, 0.1));

//   return {
//     primary,
//     secondary,
//     tertiary,
//   };
// };

// const generateTextActionVariants = (baseColor: string) => {
//   const primary = generateActionColors(lighten(baseColor, 0.5));
//   const secondary = generateActionColors(darken(baseColor, 0.3));
//   const tertiary = generateActionColors(darken(baseColor, 0.4));
//   const link = generateActionColors(darken(baseColor, 0.4));

//   primary.default = isReadable(baseColor, primary.default, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? primary.default
//     : darken(baseColor, 0.7);

//   primary.hover = isReadable(baseColor, primary.hover, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? primary.hover
//     : darken(baseColor, 0.7);

//   primary.active = isReadable(baseColor, primary.active, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? primary.active
//     : darken(baseColor, 0.7);

//   primary.focus = isReadable(baseColor, primary.focus, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? primary.focus
//     : darken(baseColor, 0.7);

//   secondary.default = isReadable(baseColor, secondary.default, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? secondary.default
//     : darken(baseColor, 0.7);

//   secondary.hover = isReadable(baseColor, secondary.hover, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? secondary.hover
//     : darken(baseColor, 0.7);

//   secondary.active = isReadable(baseColor, secondary.active, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? secondary.active
//     : darken(baseColor, 0.7);

//   secondary.focus = isReadable(baseColor, secondary.focus, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? secondary.focus
//     : darken(baseColor, 0.7);

//   tertiary.default = isReadable(baseColor, tertiary.default, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? tertiary.default
//     : darken(baseColor, 0.7);

//   tertiary.hover = isReadable(baseColor, tertiary.hover, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? tertiary.hover
//     : darken(baseColor, 0.7);

//   tertiary.active = isReadable(baseColor, tertiary.active, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? tertiary.active
//     : darken(baseColor, 0.7);

//   tertiary.focus = isReadable(baseColor, tertiary.focus, {
//     level: 'AAA',
//     size: 'small',
//   })
//     ? tertiary.focus
//     : darken(baseColor, 0.7);

//   return {
//     primary,
//     secondary,
//     tertiary,
//     link,
//   };
// };

// const generateBrandColors = (baseColor: string) => {
//   return {
//     primary: {
//       300: darken(baseColor, 0),
//       400: darken(baseColor, 0.1),
//       500: darken(baseColor, 0.2),
//       600: darken(baseColor, 0.3),
//       700: darken(baseColor, 0.4),
//       800: darken(baseColor, 0.5),
//     },
//     gray: {
//       200: baseColor,
//       300: baseColor,
//       400: baseColor,
//       500: baseColor,
//       600: baseColor,
//       700: baseColor,
//     },
//     secondary: { 500: baseColor },
//   };
// };
