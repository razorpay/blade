/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable no-template-curly-in-string */
import setValue from '../utils/setValue';
import { opacity as opacityTokens } from '../../../blade/src/tokens/global/opacity';
import showNotification from './showNotification';

const THEME_TOKENS_COLLECTION = 'Blade Theme Tokens';

const GLOBAL_TOKENS_COLLECTION = '_global-tokens';

const makeGlobalColorTokenName = (variableName: string): string => {
  return variableName.split('/').slice(1).join('.');
};

const makeThemeTokenName = (variableName: string, isValue = false): string => {
  const transformed = variableName
    .replace(/\//g, '.')
    .replace('_global-colors', 'globalColors')
    .replace('-', '.');

  // For values, convert numeric keys to bracket notation (e.g., azure.50 -> azure[50])
  // For keys, keep dot notation so setValue can create nested objects
  if (isValue) {
    return transformed.replace(/\.(\d+)/g, '[$1]');
  }

  return transformed;
};

const opacityMap = {};
for (const [key, value] of Object.entries(opacityTokens)) {
  opacityMap[value.toFixed(2)] = `\${opacity[${key}]}`;
}

const rgbaToHsla = ({ r, g, b, a }: RGBA): string => {
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

  return `hsla(${h}, ${Math.round(s)}%, ${Math.round(l)}%, ${opacityMap[a.toFixed(2)]})`;
};
const makeThemeColorTokens = async (): Promise<Record<string, any>> => {
  const themeColorTokens = {
    onLight: {},
    onDark: {},
  };

  // filter colors collection
  const colorsCollection = (await figma.variables.getLocalVariableCollectionsAsync()).find(
    (collection) => collection.name === THEME_TOKENS_COLLECTION,
  );

  if (!colorsCollection) {
    throw new Error(
      `Could not find the "${THEME_TOKENS_COLLECTION}" variable collection in this file.`,
    );
  }

  // create modes set in the collection eg: onLight, onDark, etc.
  const colorModes = colorsCollection.modes.reduce(
    (acc, mode) => Object.assign(acc, { [mode.name]: mode.modeId }),
    {},
  );

  for (const variableId of colorsCollection.variableIds) {
    // get all the variables by their ids in our collection
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (!variable) {
      continue;
    }

    // replace the "/" from token name with "." to store in json structure
    const tokenName = makeThemeTokenName(variable.name);
    if (tokenName.includes('❌') || tokenName.includes('_') || tokenName.includes('elevation')) {
      continue;
    }

    // prepare for storing variables in code in the format of dark and light modes
    for (const [modeName, modeId] of Object.entries(colorModes)) {
      const variableModeValue: VariableValue = variable.valuesByMode[modeId as string];
      // if the variable references another variable then we take the name of the referenced variable and set that as a value
      // eg: surface.background.neutral.subtle -> globalColors.gray.200
      if (typeof variableModeValue === 'object' && 'id' in variableModeValue) {
        const referencedVariable = await figma.variables.getVariableByIdAsync(
          variableModeValue.id,
        );
        if (!referencedVariable) {
          continue;
        }
        setValue(
          themeColorTokens[modeName],
          tokenName,
          makeThemeTokenName(referencedVariable.name, true),
        );
      } else if (
        typeof variableModeValue === 'object' &&
        (tokenName.includes('transparent') || tokenName.includes('elevation'))
      ) {
        const tokenHSLAValue = rgbaToHsla(variableModeValue as RGBA);
        setValue(themeColorTokens[modeName], tokenName, `\`${tokenHSLAValue}\``);
      } else {
        console.error(
          'the theme variable token has hardcoded value',
          tokenName,
          variableModeValue,
        );
      }
    }
  }

  return themeColorTokens;
};

const makeGlobalColorTokens = async (): Promise<Record<string, any>> => {
  const globalColorTokens = {};

  // filter colors collection
  const globalColorTokensCollection = (
    await figma.variables.getLocalVariableCollectionsAsync()
  ).find((collection) => collection.name === GLOBAL_TOKENS_COLLECTION);

  if (!globalColorTokensCollection) {
    throw new Error(
      `Could not find the "${GLOBAL_TOKENS_COLLECTION}" variable collection in this file.`,
    );
  }

  const colorModes: { default: string } = globalColorTokensCollection.modes.reduce(
    (acc, mode) => Object.assign(acc, { default: mode.modeId }),
    { default: '' },
  );

  for (const variableId of globalColorTokensCollection.variableIds) {
    // get all the variables by their ids in our collection
    const variable = await figma.variables.getVariableByIdAsync(variableId);
    if (variable && variable.name.includes('_global-colors')) {
      // replace the "/" from token name with "." to store in json structure
      const tokenName = makeGlobalColorTokenName(variable.name);
      const variableColor = variable.valuesByMode[colorModes.default] as RGBA;
      if (typeof variableColor === 'object') {
        const tokenHSLAValue = rgbaToHsla(variableColor);
        setValue(globalColorTokens, tokenName, `\`${tokenHSLAValue}\``);
      }
    }
  }

  return globalColorTokens;
};

export const makeColorTokens = async (): Promise<void> => {
  const themeColorTokens = await makeThemeColorTokens();
  const globalColorTokens = await makeGlobalColorTokens();

  const hasThemeTokens =
    Object.keys(themeColorTokens.onLight).length && Object.keys(themeColorTokens.onDark).length;
  const hasGlobalTokens = Object.keys(globalColorTokens).length;

  if (hasThemeTokens || hasGlobalTokens) {
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
  } else {
    // Surface the failure instead of silently doing nothing so the cause is visible.
    showNotification({
      figma,
      type: 'error',
      text: `⛔️ No color tokens were generated. Ensure the "${THEME_TOKENS_COLLECTION}" and "${GLOBAL_TOKENS_COLLECTION}" variable collections exist in this file.`,
    });
  }
};

export default makeColorTokens;
