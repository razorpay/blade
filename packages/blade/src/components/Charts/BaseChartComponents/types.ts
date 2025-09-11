import type {
  XAxisProps as RechartsXAxisProps,
  YAxisProps as RechartsYAxisProps,
  CartesianGrid as RechartsCartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer as RechartsResponsiveContainer,
  ReferenceLineProps as RechartsReferenceLineProps,
} from 'recharts';
import type { ComponentProps } from 'react';
import type { ChartColorCategories, ChartCategoricalEmphasis } from '~tokens/theme/theme';

type ReferenceLineProps = {
  /**
   * The y-coordinate of the reference line.
   */
  y?: RechartsReferenceLineProps['y'];
  /**
   * The x-coordinate  of the reference line.
   */
  x?: RechartsReferenceLineProps['x'];
  /**
   * The label of the reference line.
   */
  label: string;
};

type XAxisProps = Omit<RechartsXAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the x-axis.
   */
  label?: string;
  /**
   * The data key of the x-axis.
   */
  dataKey?: string;
};
type YAxisProps = Omit<RechartsYAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the y-axis.
   */
  label?: string;
  /**
   * The data key of the y-axis.
   */
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
