/* eslint-disable no-template-curly-in-string */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import setValue from '../utils/setValue';
import showNotification from './showNotification';

const COLLECTION_NAME = '_global-tokens';
// const COLOR_MODE_VALUE_ID = '68259:0';

const makeTokenName = (variableName: string): string => {
  return variableName.split('/').slice(1).join('.');
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

const makeGlobalColorTokens = (): void => {
  try {
    // filter colors collection
    const globalColorTokensCollection = figma.variables
      .getLocalVariableCollections()
      .find((collection) => collection.name === COLLECTION_NAME);

    const colorModes: { default: string } = globalColorTokensCollection.modes.reduce(
      (acc, mode) => Object.assign(acc, { default: mode.modeId }),
      { default: '' },
    );

    const globalColorTokens = {};

    globalColorTokensCollection.variableIds.forEach((variableId) => {
      // get all the variables by their ids in our collection
      const variable = figma.variables.getVariableById(variableId);
      if (variable.name.includes('_global-colors')) {
        // replace the "/" from token name with "." to store in json structure
        const tokenName = makeTokenName(variable.name);
        const variableColor = variable.valuesByMode[colorModes.default] as RGBA;
        if (typeof variableColor === 'object') {
          const tokenHSLAValue = rgbaToHsla(variableColor);
          setValue(globalColorTokens, tokenName, `\`${tokenHSLAValue}\``);
        }
      }
    });

    if (Object.keys(globalColorTokens).length) {
      showNotification({
        figma,
        type: 'information',
        text: '✅ Global color tokens created!',
      });
      figma.ui.postMessage({
        type: 'export-global-color-tokens',
        data: globalColorTokens,
      });
      console.log({ globalColorTokens });
      figma.ui.show();
    }
  } catch (error) {
    console.error('error', error);
    showNotification({
      figma,
      type: 'error',
      text: `⛔️ Something went wrong: ${error} `,
    });
  }
};

export default makeGlobalColorTokens;
