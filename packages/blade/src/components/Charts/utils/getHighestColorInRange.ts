import type { ChartColorToken } from '../CommonChartComponents/types';

type ColorIntensity = 'faint' | 'subtle' | 'moderate' | 'intense' | 'strong';

/**
 *
 * @param colorToken - The color token to get the highest color for
 * @param followIntensityMapping - Whether to follow the intensity mapping for the color token (only for categorical colors)
 * if enabled, the color token will be mapped to the intensity based on the intensity mapping
 * if disabled, the color token will be mapped to the strong intensity
 * @returns The highest color token in the range
 */

export const getHighestColorInRange = ({
  colorToken,
  followIntensityMapping = false,
}: {
  colorToken: ChartColorToken;
  followIntensityMapping?: boolean;
}): ChartColorToken => {
  // Check if it's a sequential color token
  const sequentialMatch = colorToken.match(/^data\.background\.sequential\.([^.]+)\.(\d+)$/);
  if (sequentialMatch) {
    const [, colorName] = sequentialMatch;
    return (`data.background.sequential.${colorName}.1000` as unknown) as ChartColorToken;
  }

  // Check if it's a categorical color token
  const categoricalMatch = colorToken.match(/^data\.background\.categorical\.([^.]+)\.([^.]+)$/);
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
      return (`data.background.categorical.${colorName}.${mappedIntensity}` as unknown) as ChartColorToken;
    } else {
      // Default behavior: always return strong
      return (`data.background.categorical.${colorName}.strong` as unknown) as ChartColorToken;
    }
  }

  // This should never happen due to TypeScript typing, but handle gracefully
  console.warn(
    `Invalid color token format: ${colorToken}. Expected format: data.background.{categorical|sequential}.{color}.{intensity|value}`,
  );
  return colorToken;
};
