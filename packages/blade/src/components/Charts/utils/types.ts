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

export type { ColorTheme, ChartName, ColorIntensity, ChartColorTokenNames };
