import type { ChartsCategoricalColorToken } from '../types';
import { DEFAULT_COLOR } from '../tokens';

type DataColorMapping = Record<
  string,
  {
    colorToken?: ChartsCategoricalColorToken | undefined;
    isCustomColor: boolean;
  }
>;

/**
 * Assigns colors to dataColorMapping based on theme colors and handles edge cases
 * @param dataColorMapping - The data color mapping object to modify
 * @param themeColors - Array of theme colors to assign
 * @returns The modified dataColorMapping object
 */
export const assignDataColorMapping = (
  dataColorMapping: DataColorMapping,
  themeColors: ChartsCategoricalColorToken[],
): DataColorMapping => {
  // Check if dataColor mapping has only one key and if it does, we need to add the default color to the dataColorMapping if no color is provided.
  if (
    Object.keys(dataColorMapping).length === 1 &&
    !dataColorMapping[Object.keys(dataColorMapping)[0]]?.colorToken
  ) {
    dataColorMapping[Object.keys(dataColorMapping)[0]] = {
      colorToken: DEFAULT_COLOR,
      isCustomColor: false,
    };
  }

  // Assign theme colors to the dataColorMapping, if no color is assigned.
  Object.keys(dataColorMapping).forEach((key, index) => {
    if (!dataColorMapping[key]?.colorToken) {
      dataColorMapping[key] = {
        colorToken: themeColors[index],
        isCustomColor: false,
      };
    }
  });

  return dataColorMapping;
};
