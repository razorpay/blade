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
  DataColorCategories,
  DataCategoricalEmphasis,
  DataSequentialEmphasis,
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
  /**
   * Controlled state: Array of dataKeys that are currently selected (visible).
   * When provided, the component is in controlled mode.
   */
  selectedDataKeys?: string[];
  /**
   * Default selected dataKeys for uncontrolled mode.
   * If not provided, all dataKeys are selected by default.
   */
  defaultSelectedDataKeys?: string[];
  /**
   * Callback fired when the selection changes.
   * Provides the dataKey of the clicked legend item and whether it's currently selected.
   */
  onSelectedDataKeysChange?: ({ dataKey, isSelected }: { dataKey: string; isSelected: boolean }) => void;
};

type ChartCartesianGridProps = Omit<
  RechartsCartesianGridProps,
  'strokeDasharray' | 'verticalFill' | 'horizontalFill'
>;

type ChartsCategoricalColorToken = `data.background.categorical.${DataColorCategories}.${keyof DataCategoricalEmphasis}`;
type ChartSequentialColorToken = `data.background.sequential.${Exclude<
  DataColorCategories,
  'gray'
>}.${keyof DataSequentialEmphasis}`;

type ChartColorToken = ChartsCategoricalColorToken | ChartSequentialColorToken;
// State type - contains only the state values
type CommonChartComponentsStateType = {
  dataColorMapping?: DataColorMapping;
  chartName?: ChartName;
  visibleDataKeys?: Set<string>;
};

// Dispatch type - contains only the updater functions
type CommonChartComponentsDispatchType = {
  setDataColorMapping?: (dataColorMapping: DataColorMapping) => void;
  /**
   * Internal handler to set visible data keys.
   * Called by ChartLegend to sync selection state.
   */
  setVisibleDataKeys?: (visibleDataKeys: Set<string>) => void;
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
  ChartColorToken,
};
