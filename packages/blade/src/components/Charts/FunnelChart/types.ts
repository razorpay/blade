import type { ChartsCategoricalColorToken } from '../CommonChartComponents/types';
import type { BoxProps } from '~components/Box';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type data = {
  [key: string]: string | number;
};

type ChartFunnelProps = {
  /**
   * Key of the count in each row of `ChartFunnelWrapper`'s `data`.
   */
  dataKey: string;
  /**
   * Tooltip label of the solid part of a column: who reached the step.
   * @default 'Reached'
   */
  name?: string;
  /**
   * Tooltip label of the hatched part of a column: who dropped since the previous step.
   * @default 'Dropped'
   */
  droppedName?: string;
  /**
   * Colour of the solid part. The hatch and the hover state use lighter and darker steps of the same colour.
   * @default 'data.background.categorical.blue.moderate'
   */
  color?: ChartsCategoricalColorToken;
  /**
   * Formats the counts in the tooltip.
   * @default Indian digit grouping, e.g. `12,34,567`
   */
  formatValue?: (value: number) => string;
};

type ChartFunnelWrapperProps = {
  /**
   * One row per step, in funnel order.
   */
  data: data[];
  /**
   * One `<ChartFunnel>`, plus any of `ChartXAxis`, `ChartYAxis`, `ChartCartesianGrid` and `ChartTooltip`.
   */
  children: React.ReactNode;
} & BoxProps &
  TestID &
  DataAnalyticsAttribute;

export type { ChartFunnelProps, ChartFunnelWrapperProps };
