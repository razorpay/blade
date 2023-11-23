/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implicit-any-catch */
import setValue from '../utils/setValue';
import showNotification from './showNotification';

// Figma to code sync
// * filter by collection ✅
// * identify modes light/dark ✅
// * convert the / to . ✅
// * convert the names to camelcase - keep it the same on design
// * create code syntax variable ✅
// * write to a file ✅
// * write a subplugin to create the dev token names

const COLLECTION_NAME = 'Colors';

const makeTokenName = (variableName: string): string => {
  return variableName.replace(/\//g, '.');
};

const makeThemeColorTokens = (): void => {
  try {
    // filter colors collection
    const colorsCollection = figma.variables
      .getLocalVariableCollections()
      .find((collection) => collection.name === COLLECTION_NAME);

    // create modes set in the collection eg: onLight, onDark, etc.
    const colorModes = colorsCollection.modes.reduce(
      (acc, mode) => Object.assign(acc, { [mode.name]: mode.modeId }),
      {},
    );

    const colorTokens = {
      onLight: {},
      onDark: {},
    };

    colorsCollection.variableIds.forEach((variableId) => {
      // get all the variables by their ids in our collection
      const variable = figma.variables.getVariableById(variableId);

      // replace the "/" from token name with "." to store in json structure
      const tokenName = makeTokenName(variable.name);

      // prepare for storing variables in code in the format of dark and light modes
      for (const [modeName, modeId] of Object.entries(colorModes)) {
        const variableModeValue: VariableValue = variable.valuesByMode[modeId as string];
        // if the variable references another variable then we take the name of the referenced variable
        // eg: surface.background.neutral.subtle -> globalColors.gray.200
        if (variableModeValue.id) {
          setValue(
            colorTokens[modeName],
            tokenName,
            makeTokenName(figma.variables.getVariableById(variableModeValue.id).name),
          );
        } else {
          setValue(colorTokens[modeName], tokenName, variableModeValue);
        }
      }
    });

    if (Object.keys(colorTokens.onLight).length && Object.keys(colorTokens.onDark).length) {
      showNotification({
        figma,
        type: 'information',
        text: '✅ Theme color tokens created!',
      });
      figma.ui.postMessage({
        type: 'export-theme-color-tokens',
        data: colorTokens,
      });
      console.log({ colorTokens });
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

export default makeThemeColorTokens;
