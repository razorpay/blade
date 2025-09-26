import { useTheme } from '~components/BladeProvider';
/**
 * The color theme of the chart.
 * @default 'categorical'
 * @description The color theme of the chart.
 *
 */
export type ColorTheme = 'categorical';

const useChartsColorTheme = ({
  colorTheme = 'categorical',
}: {
  colorTheme?: ColorTheme;
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
    console.log(`${colorTheme} is not supported. Blade only supports 'categorical'  color theme`);
  }

  //TODO:Currently we only have one color theme will add more color theme later.

  return categoricalColorThemeArray;
};

export default useChartsColorTheme;
