import type { ColorTheme, ChartName, ChartColorTokenNames, ColorIntensity } from './types';
import { colorSequence } from './tokens';
/**
 * The color theme of the chart.
 * @default 'categorical'
 * @description The color theme of the chart.
 */

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
    return ['data.background.categorical.gray.moderate'];
  }

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
      const colorValue = `data.background.categorical.${colorName}.${intensity}`;
      colorThemeArray.push(colorValue as CategoricalColorToken);
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
type CategoricalColorToken = `data.background.categorical.${ChartColorTokenNames}.${ColorIntensity}`;

export default useChartsColorTheme;
