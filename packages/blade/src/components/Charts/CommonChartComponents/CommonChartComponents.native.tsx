import type React from 'react';
import type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
} from './types';
import { componentId } from './tokens';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';

/**
 * On native, common chart components are *marker* components.
 * Chart wrappers (ChartBarWrapper, ChartLineWrapper, ...) read their props
 * via `React.Children.forEach` + `getComponentId(child)` and render the chart
 * themselves with `react-native-svg`. The marker components themselves render
 * nothing.
 *
 * ChartTooltip is consumed by ChartBarWrapper today. Other chart wrappers
 * that haven't yet implemented tooltip rendering will silently ignore it
 * until support lands.
 */
const _ChartXAxis = (_props: ChartXAxisProps): React.ReactElement | null => null;
const ChartXAxis = assignWithoutSideEffects(_ChartXAxis, {
  componentId: componentId.chartXAxis,
});

const _ChartYAxis = (_props: ChartYAxisProps): React.ReactElement | null => null;
const ChartYAxis = assignWithoutSideEffects(_ChartYAxis, {
  componentId: componentId.chartYAxis,
});

const _ChartCartesianGrid = (_props: ChartCartesianGridProps): React.ReactElement | null => null;
const ChartCartesianGrid = assignWithoutSideEffects(_ChartCartesianGrid, {
  componentId: componentId.chartCartesianGrid,
});

const _ChartTooltip = (_props: ChartTooltipProps): React.ReactElement | null => null;
const ChartTooltip = assignWithoutSideEffects(_ChartTooltip, {
  componentId: componentId.chartTooltip,
});

const _ChartLegend = (_props: ChartLegendProps): React.ReactElement | null => null;
const ChartLegend = assignWithoutSideEffects(_ChartLegend, {
  componentId: componentId.chartLegend,
});

const _ChartReferenceLine = (_props: ChartReferenceLineProps): React.ReactElement | null => null;
const ChartReferenceLine = assignWithoutSideEffects(_ChartReferenceLine, {
  componentId: componentId.chartReferenceLine,
});

export type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
};
export {
  ChartXAxis,
  ChartYAxis,
  ChartCartesianGrid,
  ChartLegend,
  ChartTooltip,
  ChartReferenceLine,
};
