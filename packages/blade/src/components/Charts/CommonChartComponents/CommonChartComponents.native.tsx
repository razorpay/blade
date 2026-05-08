import React from 'react';
import type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
} from './types';
import { logger } from '~utils/logger';
import { Text } from '~components/Typography';

const ChartXAxis: React.FC<ChartXAxisProps> = () => {
  logger({ type: 'warn', message: 'XAxis is not yet implemented for native', moduleName: 'XAxis' });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartYAxis: React.FC<ChartYAxisProps> = () => {
  logger({
    type: 'warn',
    message: 'ChartYAxis is not yet implemented for native',
    moduleName: 'ChartYAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartCartesianGrid: React.FC<ChartCartesianGridProps> = () => {
  logger({
    type: 'warn',
    message: 'ChartCartesianGrid is not yet implemented for native',
    moduleName: 'ChartCartesianGrid',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartTooltip: React.FC<ChartTooltipProps> = () => {
  logger({
    type: 'warn',
    message: 'ChartTooltip is not yet implemented for native',
    moduleName: 'ChartTooltip',
  });

  return <Text>ChartTooltip is not available for Native mobile apps.</Text>;
};

const ChartLegend: React.FC<ChartLegendProps> = () => {
  logger({
    type: 'warn',
    message: 'ChartLegend is not yet implemented for native',
    moduleName: 'ChartLegend',
  });

  return <Text>ChartLegend is not available for Native mobile apps.</Text>;
};

const ChartReferenceLine: React.FC<ChartReferenceLineProps> = () => {
  logger({ type: 'warn', message: 'XAxis is not yet implemented for native', moduleName: 'XAxis' });

  return <Text>XAxis is not available for Native mobile apps.</Text>;
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
  ChartTooltip,
  ChartReferenceLine,
};
