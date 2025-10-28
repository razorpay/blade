import type { ChartColorTokenNames } from './types';

// Color sequence
const colorSequence: ChartColorTokenNames[] = [
  'blue',
  'green',
  'gold',
  'purple',
  'orange',
  'pink',
  'skyBlue',
  'red',
  'gray',
];

const totalChartColors = colorSequence.length;

const DEFAULT_COLOR = 'data.background.categorical.gray.moderate';

export { colorSequence, totalChartColors, DEFAULT_COLOR };
