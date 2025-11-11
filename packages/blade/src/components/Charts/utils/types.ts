import type {
  DataColorCategories,
  DataCategoricalEmphasis,
  DataSequentialEmphasis,
} from '~tokens/theme/theme';

type ColorTheme = 'categorical';

/**
 * Chart types that determine color sequence
 */
type ChartName = 'bar' | 'donut' | 'line' | 'area';

/**
 * Color intensity levels
 */
type ColorIntensity = 'faint' | 'subtle' | 'moderate' | 'intense' | 'strong';

/**
 * Color names in the sequence
 */
type ChartColorTokenNames =
  | 'blue'
  | 'green'
  | 'red'
  | 'orange'
  | 'skyBlue'
  | 'purple'
  | 'pink'
  | 'gold'
  | 'gray';

type ChartsCategoricalColorToken = `data.background.categorical.${DataColorCategories}.${keyof DataCategoricalEmphasis}`;
type ChartSequentialColorToken = `data.background.sequential.${Exclude<
  DataColorCategories,
  'gray'
>}.${keyof DataSequentialEmphasis}`;

type ChartColorToken = ChartsCategoricalColorToken | ChartSequentialColorToken;

export type {
  ColorTheme,
  ChartName,
  ColorIntensity,
  ChartColorTokenNames,
  ChartColorToken,
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
};
