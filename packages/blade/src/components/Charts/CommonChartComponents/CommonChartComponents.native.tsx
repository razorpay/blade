import React from 'react';
import type {
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
  ChartLabelProps,
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
    message: 'ChartYAxis is not yet implemented for native',
    moduleName: 'ChartYAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartCartesianGrid: React.FC<ChartCartesianGridProps> = () => {
  throwBladeError({
    message: 'ChartCartesianGrid is not yet implemented for native',
    moduleName: 'ChartCartesianGrid',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartTooltip: React.FC<ChartTooltipProps> = () => {
  throwBladeError({
    message: 'ChartTooltip is not yet implemented for native',
    moduleName: 'ChartTooltip',
  });

  return <Text>ChartTooltip is not available for Native mobile apps.</Text>;
};

const ChartLegend: React.FC<ChartLegendProps> = () => {
  throwBladeError({
    message: 'ChartLegend is not yet implemented for native',
    moduleName: 'ChartLegend',
  });

  return <Text>ChartLegend is not available for Native mobile apps.</Text>;
};

const ChartReferenceLine: React.FC<ChartReferenceLineProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>XAxis is not available for Native mobile apps.</Text>;
};

const ChartLabel: React.FC<ChartLabelProps> = () => {
  throwBladeError({
    message: 'ChartLabel is not yet implemented for native',
    moduleName: 'ChartLabel',
  });

  return <Text>ChartLabel is not available for Native mobile apps.</Text>;
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
  ChartLabel,
};
