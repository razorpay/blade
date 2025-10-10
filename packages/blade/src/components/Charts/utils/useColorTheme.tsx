/**
 * The color theme of the chart.
 * @default 'categorical'
 * @description The color theme of the chart.
 */
export type ColorTheme = 'categorical';

/**
 * Chart types that determine color sequence
 */
export type ChartName = 'bar' | 'donut' | 'line' | 'area';

/**
 * Color intensity levels
 */
type ColorIntensity = 'faint' | 'subtle' | 'moderate' | 'intense' | 'strong';

/**
 * Color names in the sequence
 */
type ColorName =
  | 'azure'
  | 'emerald'
  | 'crimson'
  | 'cider'
  | 'sapphire'
  | 'orchid'
  | 'magenta'
  | 'topaz'
  | 'gray';

const useChartsColorTheme = ({
  colorTheme = 'categorical',
  chartName,
  chartDataIndicators = 0,
}: {
  colorTheme?: ColorTheme;
  chartName?: ChartName;
  chartDataIndicators?: number;
}): CategoricalColorToken[] => {
  // Single data point should be gray
  if (chartDataIndicators === 1 && chartName !== 'donut') {
    return ['chart.background.categorical.gray.moderate'];
  }

  // Color sequence: azure, emerald, crimson, cider, sapphire, orchid, magenta, topaz, gray
  const colorSequence: ColorName[] = [
    'azure',
    'emerald',
    'crimson',
    'cider',
    'sapphire',
    'orchid',
    'magenta',
    'topaz',
    'gray',
  ];

  // Intensity sequence based on chart type
  const getIntensitySequence = (chartName?: ChartName): ColorIntensity[] => {
    if (chartName === 'line' || chartName === 'area') {
      // Reverse sequence for Line and Area charts: strong, moderate, subtle, faint
      return ['strong', 'intense', 'moderate', 'subtle', 'faint'];
    } else {
      // Default sequence for Bar and Donut charts: faint, subtle, moderate, strong
      return ['faint', 'subtle', 'moderate', 'intense', 'strong'];
    }
  };

  const intensitySequence = getIntensitySequence(chartName);
  const colorThemeArray: CategoricalColorToken[] = [];

  // Generate colors based on sequence and intensity
  // For each intensity level, go through all colors
  intensitySequence.forEach((intensity) => {
    colorSequence.forEach((colorName) => {
      const colorValue = `chart.background.categorical.${colorName}.${intensity}`;
      //@ts-expect-error
      colorThemeArray.push(colorValue);
    });
  });

  if (colorTheme !== 'categorical') {
    console.log(`${colorTheme} is not supported. Blade only supports 'categorical' color theme`);
  }

  return colorThemeArray;
};

/**
 * Color token types for type safety
 */
type CategoricalColorToken = `chart.background.categorical.${ColorName}.${ColorIntensity}`;
type SequentialColorToken = `chart.background.sequential.${Exclude<ColorName, 'gray'>}.${
  | 50
  | 100
  | 200
  | 300
  | 400
  | 500
  | 600
  | 700
  | 800
  | 900
  | 1000}`;
type ChartColorToken = CategoricalColorToken | SequentialColorToken;

/**
 * Returns the highest color in a sequence for both categorical and sequential color tokens.
 *
 * @param colorToken - The color token to get the highest color for
 * @param isDynamic - Whether to use dynamic color intensity mapping for categorical colors
 * @returns The highest color token in the sequence
 *
 * @example
 * // Sequential colors
 * getHighestColorInSequence('chart.background.sequential.azure.200')
 * // Returns: 'chart.background.sequential.azure.1000'
 *
 * @example
 * // Categorical colors (default behavior)
 * getHighestColorInSequence('chart.background.categorical.azure.moderate')
 * // Returns: 'chart.background.categorical.azure.strong'
 *
 * @example
 * // Categorical colors with dynamic mapping
 * getHighestColorInSequence('chart.background.categorical.azure.faint', true)
 * // Returns: 'chart.background.categorical.azure.strong'
 * getHighestColorInSequence('chart.background.categorical.azure.subtle', true)
 * // Returns: 'chart.background.categorical.azure.intense'
 * getHighestColorInSequence('chart.background.categorical.azure.moderate', true)
 * // Returns: 'chart.background.categorical.azure.moderate'
 */
export const getHighestColorInSequence = ({
  colorToken,
  followIntensityMapping = false,
}: {
  colorToken: ChartColorToken;
  followIntensityMapping?: boolean;
}): ChartColorToken => {
  // Check if it's a sequential color token
  const sequentialMatch = colorToken.match(/^chart\.background\.sequential\.([^.]+)\.(\d+)$/);
  if (sequentialMatch) {
    const [, colorName] = sequentialMatch;
    return `chart.background.sequential.${colorName}.1000` as ChartColorToken;
  }

  // Check if it's a categorical color token
  const categoricalMatch = colorToken.match(/^chart\.background\.categorical\.([^.]+)\.([^.]+)$/);
  if (categoricalMatch) {
    const [, colorName, intensity] = categoricalMatch;

    if (followIntensityMapping) {
      // Dynamic color intensity mapping
      const intensityMapping: Record<string, ColorIntensity> = {
        faint: 'strong',
        subtle: 'intense',
        moderate: 'moderate',
        intense: 'subtle',
        strong: 'faint',
      };

      const mappedIntensity = intensityMapping[intensity] || intensity;
      return `chart.background.categorical.${colorName}.${mappedIntensity}` as ChartColorToken;
    } else {
      // Default behavior: always return strong
      return `chart.background.categorical.${colorName}.strong` as ChartColorToken;
    }
  }

  // This should never happen due to TypeScript typing, but handle gracefully
  console.warn(
    `Invalid color token format: ${colorToken}. Expected format: chart.background.{categorical|sequential}.{color}.{intensity|value}`,
  );
  return colorToken;
};

export default useChartsColorTheme;
