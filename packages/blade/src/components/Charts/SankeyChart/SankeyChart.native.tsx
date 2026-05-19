/**
 * SankeyChart is not yet implemented for React Native.
 *
 * The web implementation relies on Recharts (SVG-based) which is not
 * available in React Native's runtime. A native port would require a
 * React Native SVG library (e.g. react-native-svg) and a separate
 * layout pass. This is tracked as a future enhancement.
 */
import type React from 'react';
import type { SankeyChartProps } from './types';
import { throwBladeError } from '~utils/logger';

const SankeyChart = (_props: SankeyChartProps): React.ReactElement => {
  throwBladeError({
    moduleName: 'SankeyChart',
    message: 'SankeyChart is not yet implemented for native',
  });
  // @ts-expect-error: unreachable, throwBladeError always throws
  return null;
};

export { SankeyChart };
