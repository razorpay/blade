import React from 'react';
import type {
  XAxisProps as LineChartXAxisProps,
  YAxisProps as LineChartYAxisProps,
  CartesianGridProps as LineChartCartesianGridProps,
  ChartTooltipProps as LineChartChartTooltipProps,
  LegendProps as LineChartLegendProps,
  ReferenceLineProps as LineChartReferenceLineProps,
} from '../BaseChartComponents';
import {
  XAxis as LineChartXAxis,
  YAxis as LineChartYAxis,
  CartesianGrid as LineChartCartesianGrid,
  ChartTooltip as LineChartChartTooltip,
  Legend as LineChartLegend,
  ReferenceLine as LineChartReferenceLine,
} from '../BaseChartComponents';
import type { LineChartLineProps, LineChartProps } from './types';
import { Text } from '~components/Typography';
import { throwBladeError } from '~utils/logger';

const LineChartLine = (_prop: LineChartLineProps): React.ReactElement => {
  throwBladeError({
    message: 'LineChartLine is not yet implemented for native',
    moduleName: 'LineChartLine',
  });

  return <Text>LineChartLine is not available for Native mobile apps.</Text>;
};

const LineChart = (_prop: LineChartProps): React.ReactElement => {
  throwBladeError({
    message: 'LineChart is not yet implemented for native',
    moduleName: 'LineChart',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

export type {
  LineChartProps,
  LineChartLineProps,
  LineChartXAxisProps,
  LineChartYAxisProps,
  LineChartCartesianGridProps,
  LineChartChartTooltipProps,
  LineChartLegendProps,
  LineChartReferenceLineProps,
};
export {
  LineChart,
  LineChartLine,
  LineChartXAxis,
  LineChartYAxis,
  LineChartCartesianGrid,
  LineChartChartTooltip,
  LineChartLegend,
  LineChartReferenceLine,
};
