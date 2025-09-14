import type {
  XAxisProps as AreaChartXAxisProps,
  YAxisProps as AreaChartYAxisProps,
  CartesianGridProps as AreaChartCartesianGridProps,
  ChartTooltipProps as AreaChartChartTooltipProps,
  LegendProps as AreaChartLegendProps,
  ReferenceLineProps as AreaChartReferenceLineProps,
} from '../BaseChartComponents';
import {
  XAxis as AreaChartXAxis,
  YAxis as AreaChartYAxis,
  CartesianGrid as AreaChartCartesianGrid,
  ChartTooltip as AreaChartChartTooltip,
  Legend as AreaChartLegend,
  ReferenceLine as AreaChartReferenceLine,
} from '../BaseChartComponents';
import type { AreaChartProps, AreaProps } from './types';
import { throwBladeError } from '~utils/logger';
import { Text } from '~components/Typography';

const Area = (_prop: AreaProps): React.ReactElement => {
  throwBladeError({
    message: 'Area is not yet implemented for native',
    moduleName: 'Area',
  });

  return <Text>Area is not available for Native mobile apps.</Text>;
};

const AreaChart = (_prop: AreaChartProps): React.ReactElement => {
  throwBladeError({
    message: 'AreaChart is not yet implemented for native',
    moduleName: 'AreaChart',
  });

  return <Text>AreaChart is not available for Native mobile apps.</Text>;
};

export {
  Area,
  AreaChart,
  AreaChartXAxis,
  AreaChartYAxis,
  AreaChartCartesianGrid,
  AreaChartChartTooltip,
  AreaChartLegend,
  AreaChartReferenceLine,
};
export type {
  AreaProps,
  AreaChartProps,
  AreaChartXAxisProps,
  AreaChartYAxisProps,
  AreaChartCartesianGridProps,
  AreaChartChartTooltipProps,
  AreaChartLegendProps,
  AreaChartReferenceLineProps,
};
