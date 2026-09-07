import type { BarProps as RechartsBarProps } from 'recharts';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '../CommonChartComponents/types';
import type { ColorTheme } from '../utils';
import type { BoxProps } from '~components/Box';

type ChartBarProps = {
  /**
   * The data key of the bar chart.
   */
  dataKey: RechartsBarProps['dataKey'];
  /**
   * The name of the bar chart.
   */
  name?: RechartsBarProps['name']; // default to dataKey
  /**
   * The color of the bar chart.
   */
  color?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * The stack id of the bar chart.
   */
  stackId?: RechartsBarProps['stackId'];
  /**
   * The active bar of the bar chart.
   */
  activeBar?: RechartsBarProps['activeBar'];
  /**
   * The label of the bar chart.
   */
  label?: RechartsBarProps['label'];
  /**
   * The show legend of the bar chart.
   */
  showLegend?: boolean;
  /**
   * Whether to hide the bar.
   *
   */
  hide?: boolean;
  /**
   * The width of the bar in pixels.
   */
  barSize?: RechartsBarProps['barSize'];
  /**
   * Data key for the lower (min) bound of this bar's reference range.
   * A band is drawn for this bar only when both `rangeLowerDataKey` and `rangeUpperDataKey` are set.
   *
   * The band is revealed while this bar is hovered, so several bars can each declare their own
   * range without the bands overlapping.
   */
  rangeLowerDataKey?: string;
  /**
   * Data key for the upper (max) bound of this bar's reference range.
   */
  rangeUpperDataKey?: string;
  /**
   * Label shown for this bar's range in the legend and the tooltip.
   * @default 'Industry range'
   */
  rangeName?: string;
  /**
   * Fill color of this bar's range band.
   * @default the bar's own resolved color
   */
  rangeColor?: ChartsCategoricalColorToken | ChartSequentialColorToken;
  /**
   * Whether to show a legend swatch for this bar's range band. Off by default because the band is
   * only on screen while its bar is hovered.
   * @default false
   */
  showRangeLegend?: boolean;
  /**
   * The index of the bar chart.
   * @private
   */
  _index?: number;
  /**
   * @private
   */
  _totalbars?: number;
};

type data = {
  [key: string]: string | number;
};

type ChartBarWrapperProps = {
  children?: React.ReactNode;
  /**
   * The color theme of the chart.
   * @default 'categorical'
   */
  colorTheme?: ColorTheme;
  /**
   * The layout of the bar chart.
   */
  layout?: 'horizontal' | 'vertical';
  /**
   * Chart data to be rendered
   */
  data: data[];
} & BoxProps;

interface BarChartContextType {
  layout?: 'horizontal' | 'vertical';
  activeIndex?: number;
  colorTheme: ColorTheme;
  totalBars: number;
  /**
   * dataKey of the bar series currently hovered, or `null`. Drives both the fade applied to the
   * other series and which per-bar reference band is revealed.
   */
  hoveredDataKey?: string | null;
  /**
   * Index of the hovered bar within its series, i.e. which category is hovered. Read straight off
   * the hovered bar rather than from the chart's `activeIndex`, so the shaded category column can
   * never disagree with the band being shown.
   */
  hoveredBarIndex?: number | null;
  setHoveredBar?: (bar: { dataKey: string; index: number } | null) => void;
}

export type { ChartBarProps, ChartBarWrapperProps, BarChartContextType };
