import type {
  XAxisProps as RechartsXAxisProps,
  YAxisProps as RechartsYAxisProps,
  CartesianGridProps as RechartsCartesianGridProps,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ReferenceLineProps as RechartsReferenceLineProps,
} from 'recharts';
import type { ComponentProps } from 'react';
import type {
  ChartColorCategories,
  ChartCategoricalEmphasis,
  ChartSequentialEmphasis,
} from '~tokens/theme/theme';

type ChartReferenceLineProps = {
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

type ChartXAxisProps = Omit<RechartsXAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the x-axis.
   */
  label?: string;
  /**
   * The data key of the x-axis.
   */
  dataKey?: string;
};
type ChartYAxisProps = Omit<RechartsYAxisProps, 'tick' | 'label' | 'dataKey' | 'stroke'> & {
  /**
   * The label of the y-axis.
   */
  label?: string;
  /**
   * The data key of the y-axis.
   */
  dataKey?: string;
};

type Layout = 'horizontal' | 'vertical';
type Align = 'left' | 'right';
type ChartName = 'bar' | 'donut' | 'line' | 'area';
type DataColorMapping = Record<
  string,
  {
    colorToken: ChartsCategoricalColorToken;
    isCustomColor: boolean;
  }
>;

type ChartTooltipProps = ComponentProps<typeof RechartsTooltip>;
type ChartLegendProps = ComponentProps<typeof RechartsLegend> & {
  layout?: Layout;
  align?: Align;
};

type ChartCartesianGridProps = Omit<
  RechartsCartesianGridProps,
  'strokeDasharray' | 'verticalFill' | 'horizontalFill'
>;

type ChartsCategoricalColorToken = `chart.background.categorical.${ChartColorCategories}.${keyof ChartCategoricalEmphasis}`;
type ChartSequentialColorToken = `chart.background.sequential.${Exclude<
  ChartColorCategories,
  'gray'
>}.${keyof ChartSequentialEmphasis}`;

// State type - contains only the state values
type CommonChartComponentsStateType = {
  dataColorMapping?: DataColorMapping;
  chartName?: ChartName;
};

// Dispatch type - contains only the updater functions
type CommonChartComponentsDispatchType = {
  setDataColorMapping?: (dataColorMapping: DataColorMapping) => void;
};

// Legacy combined type for backward compatibility
type CommonChartComponentsContextType = CommonChartComponentsStateType &
  CommonChartComponentsDispatchType;

export type {
  CommonChartComponentsContextType,
  CommonChartComponentsStateType,
  CommonChartComponentsDispatchType,
  ChartReferenceLineProps,
  ChartXAxisProps,
  ChartYAxisProps,
  ChartTooltipProps,
  ChartLegendProps,
  ChartCartesianGridProps,
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
  Layout,
  Align,
  DataColorMapping,
};
