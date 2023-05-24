const { getLeaves } = require('any-leaf');
const StyleDictionary = require('style-dictionary');
const set = require('lodash/set');
const cloneDeep = require('lodash/cloneDeep');
const chalk = require('chalk');
const figures = require('figures');

const { paymentTheme, bankingTheme } = require('../build/js-bundle-for-css/tokensBundle');
const {
  makeBorderSize,
  makeMotionTime,
  makeSpace,
  makeTypographySize,
  makeSize,
} = require('../build/js-bundle-for-css/utilsBundle');

const getThemeFromTokens = ({ onColorMode, onDeviceType, themeTokens }) => {
  return {
    ...themeTokens,
    colors: themeTokens.colors[onColorMode],
    elevation: themeTokens.elevation[onColorMode],
    typography: themeTokens.typography[onDeviceType],
  };
};

const getStyledDictionaryConfig = ({ outputFileName, tokens }) => {
  return {
    tokens,
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [
          {
            destination: `${outputFileName}.css`,
            format: 'css/variables',
          },
        ],
      },
    },
  };
};

const makeValue = ({ path, value }) => {
  if (path.includes('border.radius') || path.includes('border.width')) {
    value = makeBorderSize(value);
  } else if (path.includes('motion.duration') || path.includes('motion.delay')) {
    value = makeMotionTime(value);
  } else if (path.includes('breakpoints')) {
    value = makeSize(value);
  } else if (path.includes('spacing')) {
    value = makeSpace(value);
  } else if (path.includes('fonts.size') || path.includes('lineHeights')) {
    value = makeTypographySize(value);
  }
  return value;
};

const convertToStyledDictionarySchema = ({ themeTokens }) => {
  const newTokens = cloneDeep(themeTokens);
  const leafNodes = getLeaves(newTokens);

  leafNodes.forEach(({ path, value }) => {
    value = makeValue({ path, value });
    set(newTokens, path, { value });
  });
  return newTokens;
};

const getThemeFromTokensCSSTokens = () => {
  try {
    const styledDictionaryPaymentTheme = convertToStyledDictionarySchema({
      themeTokens: paymentTheme,
    });
    const styledDictionaryBankingTheme = convertToStyledDictionarySchema({
      themeTokens: bankingTheme,
    });

    // Payment Light Desktop

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'paymentThemeLightDesktop',
        tokens: getThemeFromTokens({
          onColorMode: 'onLight',
          onDeviceType: 'onDesktop',
          themeTokens: styledDictionaryPaymentTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Payment Dark Desktop

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'paymentThemeDarkDesktop',
        tokens: getThemeFromTokens({
          onColorMode: 'onDark',
          onDeviceType: 'onDesktop',
          themeTokens: styledDictionaryPaymentTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Payment Light Mobile

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'paymentThemeLightMobile',
        tokens: getThemeFromTokens({
          onColorMode: 'onLight',
          onDeviceType: 'onMobile',
          themeTokens: styledDictionaryPaymentTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Payment Dark Mobile

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'paymentThemeDarkMobile',
        tokens: getThemeFromTokens({
          onColorMode: 'onDark',
          onDeviceType: 'onMobile',
          themeTokens: styledDictionaryPaymentTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Banking Light Desktop

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'bankingThemeLightDesktop',
        tokens: getThemeFromTokens({
          onColorMode: 'onLight',
          onDeviceType: 'onDesktop',
          themeTokens: styledDictionaryBankingTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Banking Dark Desktop

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'bankingThemeDarkDesktop',
        tokens: getThemeFromTokens({
          onColorMode: 'onDark',
          onDeviceType: 'onDesktop',
          themeTokens: styledDictionaryBankingTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Banking Light Mobile

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'bankingThemeLightMobile',
        tokens: getThemeFromTokens({
          onColorMode: 'onLight',
          onDeviceType: 'onMobile',
          themeTokens: styledDictionaryBankingTheme,
        }),
      }),
    ).buildAllPlatforms();

    // Banking Dark Mobile

    StyleDictionary.extend(
      getStyledDictionaryConfig({
        outputFileName: 'bankingThemeDarkMobile',
        tokens: getThemeFromTokens({
          onColorMode: 'onDark',
          onDeviceType: 'onMobile',
          themeTokens: styledDictionaryBankingTheme,
        }),
      }),
    ).buildAllPlatforms();
  } catch (error) {
    console.log(
      '\n',
      chalk.red(`${figures.cross} error while generating CSS theme variables`),
      '\n',
      chalk.red(error),
      '\n',
    );
  }
};

getThemeFromTokensCSSTokens();
