/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable no-template-curly-in-string */
import setValue from '../utils/setValue';
import showNotification from './showNotification';

const THEME_TOKENS_COLLECTION = 'Colors';

const GLOBAL_TOKENS_COLLECTION = '_global-tokens';
// const COLOR_MODE_VALUE_ID = '68259:0';

const makeGlobalColorTokenName = (variableName: string): string => {
  return variableName.split('/').slice(1).join('.');
};

const makeThemeTokenName = (variableName: string): string => {
  return variableName
    .replace(/\//g, '.')
    .replace('_global-colors', 'globalColors')
    .replace('-', '.')
    .replace(/\.[0-9]+/, (matchedString: any) => `[${matchedString.replace('.', '')}]`);
};

const makeThemeColorTokens = (): Record<string, any> => {
  const themeColorTokens = {
    onLight: {},
    onDark: {},
  };
  try {
    // filter colors collection
    const colorsCollection = figma.variables
      .getLocalVariableCollections()
      .find((collection) => collection.name === THEME_TOKENS_COLLECTION);

    // create modes set in the collection eg: onLight, onDark, etc.
    const colorModes = colorsCollection.modes.reduce(
      (acc, mode) => Object.assign(acc, { [mode.name]: mode.modeId }),
      {},
    );

    colorsCollection.variableIds.forEach((variableId) => {
      // get all the variables by their ids in our collection
      const variable = figma.variables.getVariableById(variableId);

      // replace the "/" from token name with "." to store in json structure
      const tokenName = makeThemeTokenName(variable.name);

      // prepare for storing variables in code in the format of dark and light modes
      for (const [modeName, modeId] of Object.entries(colorModes)) {
        const variableModeValue: VariableValue = variable.valuesByMode[modeId as string];
        // if the variable references another variable then we take the name of the referenced variable
        // eg: surface.background.neutral.subtle -> globalColors.gray.200
        if (typeof variableModeValue === 'object' && 'id' in variableModeValue) {
          setValue(
            themeColorTokens[modeName],
            tokenName,
            makeThemeTokenName(figma.variables.getVariableById(variableModeValue.id).name),
          );
        } else {
          console.error(
            'the theme variable token has hardcoded value',
            tokenName,
            variableModeValue,
          );
        }
      }
    });
  } catch (error) {
    console.error('error', error);
    showNotification({
      figma,
      type: 'error',
      text: `⛔️ Something went wrong in creating theme color tokens: ${error} `,
    });
  }

  return themeColorTokens;
};

const rgbaToHsla = ({ r, g, b, a }: RGBA): string => {
  const opacity = {
    '0.00': '${opacity[0]}',
    '0.09': '${opacity[1]}',
    '0.18': '${opacity[2]}',
    '0.32': '${opacity[3]}',
    '0.48': '${opacity[4]}',
    '0.56': '${opacity[5]}',
    '0.64': '${opacity[6]}',
    '0.72': '${opacity[7]}',
    '1.00': '${opacity[9]}',
  };

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b);
  const cmax = Math.max(r, g, b);
  const delta = cmax - cmin;
  let h = 0;
  let s = 0;
  let l = 0;

  if (delta == 0) {
    h = 0;
  } else if (cmax == r) {
    // Red is max
    h = ((g - b) / delta) % 6;
  } else if (cmax == g) {
    // Green is max
    h = (b - r) / delta + 2;
  } else {
    // Blue is max
    h = (r - g) / delta + 4;
  }

  h = Math.round(h * 60);

  // Make negative hues positive behind 360°
  if (h < 0) {
    h += 360;
  }

  l = (cmax + cmin) / 2;

  // Calculate saturation
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return `hsla(${h}, ${Math.round(s)}%, ${Math.round(l)}%, ${opacity[a.toFixed(2)]})`;
};

const makeGlobalColorTokens = (): Record<string, any> => {
  const globalColorTokens = {};
  try {
    // filter colors collection
    const globalColorTokensCollection = figma.variables
      .getLocalVariableCollections()
      .find((collection) => collection.name === GLOBAL_TOKENS_COLLECTION);

    const colorModes: { default: string } = globalColorTokensCollection.modes.reduce(
      (acc, mode) => Object.assign(acc, { default: mode.modeId }),
      { default: '' },
    );

    globalColorTokensCollection.variableIds.forEach((variableId) => {
      // get all the variables by their ids in our collection
      const variable = figma.variables.getVariableById(variableId);
      if (variable.name.includes('_global-colors')) {
        // replace the "/" from token name with "." to store in json structure
        const tokenName = makeGlobalColorTokenName(variable.name);
        const variableColor = variable.valuesByMode[colorModes.default] as RGBA;
        if (typeof variableColor === 'object') {
          const tokenHSLAValue = rgbaToHsla(variableColor);
          setValue(globalColorTokens, tokenName, `\`${tokenHSLAValue}\``);
        }
      }
    });
  } catch (error) {
    console.error('error', error);
    showNotification({
      figma,
      type: 'error',
      text: `⛔️ Something went wrong in creating global color tokens: ${error} `,
    });
  }

  return globalColorTokens;
};

export const makeColorTokens = (): void => {
  const themeColorTokens = makeThemeColorTokens();
  const globalColorTokens = makeGlobalColorTokens();

  if (
    (Object.keys(themeColorTokens.onLight).length && Object.keys(themeColorTokens.onDark).length) ||
    Object.keys(globalColorTokens).length
  ) {
    showNotification({
      figma,
      type: 'information',
      text: '✅ Color tokens created!',
    });
    figma.ui.postMessage({
      type: 'export-color-tokens',
      data: { themeColorTokens, globalColorTokens },
    });
    console.log({ themeColorTokens, globalColorTokens });
    figma.ui.show();
  }
};

export default makeColorTokens;
