const { getLeaves } = require('any-leaf');
const StyleDictionary = require('style-dictionary');
const set = require('lodash/fp/set');

const { paymentTheme, bankingTheme } = require('../generated/themeBundle');

function getThemeFromTokens({ onColorMode, onDeviceType, themeTokens }) {
  return {
    ...themeTokens,
    colors: themeTokens.colors[onColorMode],
    shadows: {
      ...themeTokens.shadows,
      color: themeTokens.shadows.color[onColorMode],
    },
    typography: themeTokens.typography[onDeviceType],
  };
}

function getStyledDictionaryConfig({ outputFileName, tokens }) {
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
}

function convertToStyledDictionarySchema({ themeTokens }) {
  const leafNodes = getLeaves(themeTokens);

  leafNodes.forEach(({ path, value }) => {
    themeTokens = set(path, { value }, themeTokens);
  });
  return themeTokens;
}

const getThemeFromTokensCSSTokens = () => {
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
};

getThemeFromTokensCSSTokens();
