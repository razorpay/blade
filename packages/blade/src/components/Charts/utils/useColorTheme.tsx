import { useTheme } from '~components/BladeProvider';

const useChartsColorTheme = ({
  colorTheme = 'default',
}: {
  colorTheme: 'default' | 'informational';
}): string[] => {
  console.log('colorTheme', colorTheme);
  const { theme } = useTheme();
  const defaultColorThemeArray = [
    theme.colors.chart.background.categorical.azure.strong,
    theme.colors.chart.background.categorical.topaz.strong,
    theme.colors.chart.background.categorical.orchid.strong,
    theme.colors.chart.background.categorical.emerald.strong,
    theme.colors.chart.background.categorical.cider.strong,
    theme.colors.chart.background.categorical.sapphire.strong,
    theme.colors.chart.background.categorical.magenta.strong,
    theme.colors.chart.background.categorical.crimson.strong,
    theme.colors.chart.background.categorical.azure.intense,
    theme.colors.chart.background.categorical.topaz.intense,
    theme.colors.chart.background.categorical.orchid.intense,
    theme.colors.chart.background.categorical.emerald.intense,
    theme.colors.chart.background.categorical.sapphire.intense,
    theme.colors.chart.background.categorical.magenta.intense,
    theme.colors.chart.background.categorical.cider.intense,
    theme.colors.chart.background.categorical.crimson.intense,
  ];

  const informationalColorThemeArray = [
    theme.colors.chart.background.categorical.emerald.strong,
    theme.colors.chart.background.categorical.crimson.strong,
    theme.colors.chart.background.categorical.orchid.strong,
    theme.colors.chart.background.categorical.emerald.strong,
    theme.colors.chart.background.categorical.cider.strong,
    theme.colors.chart.background.categorical.sapphire.strong,
    theme.colors.chart.background.categorical.magenta.strong,
    theme.colors.chart.background.categorical.crimson.strong,
    theme.colors.chart.background.categorical.azure.intense,
    theme.colors.chart.background.categorical.topaz.intense,
    theme.colors.chart.background.categorical.orchid.intense,
    theme.colors.chart.background.categorical.emerald.intense,
    theme.colors.chart.background.categorical.sapphire.intense,
    theme.colors.chart.background.categorical.magenta.intense,
    theme.colors.chart.background.categorical.cider.intense,
    theme.colors.chart.background.categorical.crimson.intense,
  ];

  return colorTheme === 'default' ? defaultColorThemeArray : informationalColorThemeArray;
};

export default useChartsColorTheme;
