import React from 'react';
import type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
} from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const ChartXAxis: React.FC<ChartXAxisProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartYAxis: React.FC<ChartYAxisProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartCartesianGrid: React.FC<ChartCartesianGridProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartChartTooltip: React.FC<ChartTooltipProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartLegend: React.FC<ChartLegendProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartReferenceLine: React.FC<ChartReferenceLineProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

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
  ChartChartTooltip,
  ChartReferenceLine,
};
