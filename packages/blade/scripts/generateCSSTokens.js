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
  const paymentThemeLightDesktop = getThemeFromTokens({
    onColorMode: 'onLight',
    onDeviceType: 'onDesktop',
    themeTokens: { ...styledDictionaryPaymentTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'paymentThemeLightDesktop',
      tokens: paymentThemeLightDesktop,
    }),
  ).buildAllPlatforms();

  // Payment Dark Desktop
  const paymentThemeDarkDesktop = getThemeFromTokens({
    onColorMode: 'onDark',
    onDeviceType: 'onDesktop',
    themeTokens: { ...styledDictionaryPaymentTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'paymentThemeDarkDesktop',
      tokens: paymentThemeDarkDesktop,
    }),
  ).buildAllPlatforms();

  // Payment Light Mobile
  const paymentThemeLightMobile = getThemeFromTokens({
    onColorMode: 'onLight',
    onDeviceType: 'onMobile',
    themeTokens: { ...styledDictionaryPaymentTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'paymentThemeLightMobile',
      tokens: paymentThemeLightMobile,
    }),
  ).buildAllPlatforms();

  // Payment Dark Mobile
  const paymentThemeDarkMobile = getThemeFromTokens({
    onColorMode: 'onDark',
    onDeviceType: 'onMobile',
    themeTokens: { ...styledDictionaryPaymentTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'paymentThemeDarkMobile',
      tokens: paymentThemeDarkMobile,
    }),
  ).buildAllPlatforms();

  // Banking

  // Banking Light Desktop
  const bankingThemeLightDesktop = getThemeFromTokens({
    onColorMode: 'onLight',
    onDeviceType: 'onDesktop',
    themeTokens: { ...styledDictionaryBankingTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'bankingThemeLightDesktop',
      tokens: bankingThemeLightDesktop,
    }),
  ).buildAllPlatforms();

  // Banking Dark Desktop
  const bankingThemeDarkDesktop = getThemeFromTokens({
    onColorMode: 'onDark',
    onDeviceType: 'onDesktop',
    themeTokens: { ...styledDictionaryBankingTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'bankingThemeDarkDesktop',
      tokens: bankingThemeDarkDesktop,
    }),
  ).buildAllPlatforms();

  // Banking Light Mobile
  const bankingThemeLightMobile = getThemeFromTokens({
    onColorMode: 'onLight',
    onDeviceType: 'onMobile',
    themeTokens: { ...styledDictionaryBankingTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'bankingThemeLightMobile',
      tokens: bankingThemeLightMobile,
    }),
  ).buildAllPlatforms();

  // Banking Dark Mobile
  const bankingThemeDarkMobile = getThemeFromTokens({
    onColorMode: 'onDark',
    onDeviceType: 'onMobile',
    themeTokens: { ...styledDictionaryBankingTheme },
  });

  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'bankingThemeDarkMobile',
      tokens: bankingThemeDarkMobile,
    }),
  ).buildAllPlatforms();
};

getThemeFromTokensCSSTokens();
