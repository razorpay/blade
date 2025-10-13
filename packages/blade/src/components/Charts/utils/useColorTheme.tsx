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

  // Color sequence
  const colorSequence: ColorName[] = [
    'azure',
    'emerald',
    'topaz',
    'orchid',
    'cider',
    'magenta',
    'sapphire',
    'crimson',
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

export default useChartsColorTheme;
