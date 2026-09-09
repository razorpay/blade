import type { PieProps as RechartsPieProps, CellProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
  Layout,
  Align,
  ChartLegendProps,
  ChartTooltipProps,
} from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

type data = {
  [key: string]: unknown;
};

type ChartRadius = 'small' | 'medium' | 'large';

type ChartDonutProps = {
  /**
   * The data key of the Donut chart.
   */
  dataKey?: RechartsPieProps['dataKey'];
  /**
   * The name key of the Donut chart.
   */
  nameKey?: RechartsPieProps['nameKey'];
  /**
   * The x coordinate of the Donut chart.
   */
  cx?: RechartsPieProps['cx'];
  cy?: RechartsPieProps['cy'];
  /**
   * The radius of the Donut chart.
   */
  radius?: ChartRadius;
  /**
   * The children of the Donut chart.
   */
  children?: React.ReactNode;
  /**
   * The data of the Donut chart.
   */
  data: data[];
  /**
   * The color theme of the chart.
   * @default 'categorical'
   */
  colorTheme?: ColorTheme;
  /**
   * The type of the Donut chart.
   */
  type?: 'circle' | 'semicircle';
};

type Content = {
  value?: string;
  label?: string;
};

type ChartDonutWrapperProps = {
  /**
   * Content to be displayed at center of donut chart
   */
  content?: Content | React.ReactNode;
  children?: React.ReactNode;
} & BoxProps;

type ChartDonutCellProps = CellProps & {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type CellSlot = {
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type LegendSlot = {
  selectedDataKeys?: string[];
  defaultSelectedDataKeys?: string[];
  onSelectedDataKeysChange?: ChartLegendProps['onSelectedDataKeysChange'];
  layout: Layout;
  align: Align;
};

type DonutSlot = {
  data: Record<string, unknown>[];
  dataKey: string;
  nameKey: ChartDonutProps['nameKey'];
  cx: ChartDonutProps['cx'];
  cy: ChartDonutProps['cy'];
  radius: ChartRadius;
  colorTheme: ColorTheme;
  type: NonNullable<ChartDonutProps['type']>;
  cells: CellSlot[];
};

type DonutSlots = {
  donut?: DonutSlot;
  hasLegend: boolean;
  legend?: LegendSlot;
  hasTooltip: boolean;
  tooltipFormatter?: NonNullable<ChartTooltipProps['formatter']>;
};

export type {
  ChartDonutWrapperProps,
  ChartDonutCellProps,
  ChartDonutProps,
  ChartRadius,
  Content,
  CellSlot,
  DonutSlots,
};
