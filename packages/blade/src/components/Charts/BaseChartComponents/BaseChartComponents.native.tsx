import React from 'react';
import type {
  ReferenceLineProps,
  XAxisProps,
  YAxisProps,
  ChartTooltipProps,
  LegendProps,
  ResponsiveContainerProps,
  CartesianGridProps,
} from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const XAxis: React.FC<XAxisProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const YAxis: React.FC<YAxisProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const CartesianGrid: React.FC<CartesianGridProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ChartTooltip: React.FC<ChartTooltipProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const Legend: React.FC = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

export const ReferenceLine: React.FC<ReferenceLineProps> = () => {
  throwBladeError({
    message: 'XAxis is not yet implemented for native',
    moduleName: 'XAxis',
  });

  return <Text>LineChart is not available for Native mobile apps.</Text>;
};

export type {
  ReferenceLineProps,
  XAxisProps,
  YAxisProps,
  ChartTooltipProps,
  LegendProps,
  ResponsiveContainerProps,
  CartesianGridProps,
};
export { XAxis, YAxis, ResponsiveContainer, CartesianGrid, Legend, ChartTooltip };
