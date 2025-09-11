import type {
  XAxisProps as RechartsXAxisProps,
  YAxisProps as RechartsYAxisProps,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
} from 'recharts';
import type { ComponentProps } from 'react';
import type { ChartColorCategories, ChartCategoricalEmphasis } from '~tokens/theme/theme';

type ReferenceLineProps = {
  y?: number;
  x?: number;
  label: string;
};

type XAxisProps = Omit<RechartsXAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  label?: string;
  dataKey?: string;
};
type YAxisProps = Omit<RechartsYAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  label?: string;
  dataKey?: string;
};

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type LegendProps = ComponentProps<typeof RechartsLegend>;
type ResponsiveContainerProps = ComponentProps<typeof RechartsResponsiveContainer>;

type CartesianGridProps = ComponentProps<typeof RechartsCartesianGrid>;

type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;

export type {
  ReferenceLineProps,
  XAxisProps,
  YAxisProps,
  ChartTooltipProps,
  LegendProps,
  ResponsiveContainerProps,
  CartesianGridProps,
  ChartsCategoricalColorToken,
};
