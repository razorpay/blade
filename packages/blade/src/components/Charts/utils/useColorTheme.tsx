import { useTheme } from '~components/BladeProvider';
/**
 * The color theme of the chart.
 * @default 'default'
 * @description The color theme of the chart.
 * @example
 * ```tsx
 * const colorTheme = 'categorical';
 * ```
 */
export type colorTheme = 'categorical';

const useChartsColorTheme = ({
  colorTheme = 'categorical',
}: {
  colorTheme: colorTheme;
}): string[] => {
  const { theme } = useTheme();
  const categoricalColorThemeArray = [
    theme.colors.chart.background.categorical.azure.subtle,
    theme.colors.chart.background.categorical.topaz.moderate,
    theme.colors.chart.background.categorical.orchid.moderate,
    theme.colors.chart.background.categorical.emerald.subtle,
    theme.colors.chart.background.categorical.cider.moderate,
    theme.colors.chart.background.categorical.sapphire.moderate,
    theme.colors.chart.background.categorical.magenta.moderate,
    theme.colors.chart.background.categorical.crimson.subtle,
    theme.colors.chart.background.categorical.azure.intense,
    theme.colors.chart.background.categorical.topaz.intense,
    theme.colors.chart.background.categorical.orchid.intense,
    theme.colors.chart.background.categorical.emerald.intense,
    theme.colors.chart.background.categorical.sapphire.intense,
    theme.colors.chart.background.categorical.magenta.intense,
    theme.colors.chart.background.categorical.cider.intense,
    theme.colors.chart.background.categorical.crimson.intense,
  ];

  if (colorTheme !== 'categorical') {
    console.log('Currently we only categorical  color theme');
  }
  //TODO:Currently we only have one color theme will add more color theme later.

  return categoricalColorThemeArray;
};

export default useChartsColorTheme;
