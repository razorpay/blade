const fs = require('fs');
const { getLeaves } = require('any-leaf');
const StyleDictionary = require('style-dictionary');
const _ = require('lodash');

const { paymentTheme } = require('../generated/themeBundle');

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
        buildPath: 'generated/css/',
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

const convertToStyledDictionarySchema = (themeTokens) => {
  const leafNodes = getLeaves(themeTokens);

  leafNodes.forEach(({ path, value }) => {
    _.set(themeTokens, path, { value });
  });
  return themeTokens;
};

const getThemeFromTokensCSSTokens = () => {
  const styledDictionaryPaymentTheme = convertToStyledDictionarySchema(paymentTheme);

  const paymentThemeLightDesktop = getThemeFromTokens({
    onColorMode: 'onLight',
    onDeviceType: 'onDesktop',
    themeTokens: { ...styledDictionaryPaymentTheme },
  });

  fs.writeFileSync(
    './generated/paymentThemeLightDesktop.json',
    JSON.stringify(paymentThemeLightDesktop),
  );
  StyleDictionary.extend(
    getStyledDictionaryConfig({
      outputFileName: 'paymentThemeLightDesktop',
      tokens: paymentThemeLightDesktop,
    }),
  ).buildAllPlatforms();
};

getThemeFromTokensCSSTokens();
