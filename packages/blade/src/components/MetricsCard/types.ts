import type React from 'react';
import type { BoxProps } from '~components/Box';
import type {
  ChartsCategoricalColorToken,
  ChartSequentialColorToken,
} from '~components/Charts/CommonChartComponents/types';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';

type MetricsCardTrend = 'positive' | 'negative' | 'neutral';
type MetricsCardChartType = 'line' | 'area';

type MetricsCardMetricChange = {
  /**
   * Value shown next to the primary metric value.
   */
  value: string;

  /**
   * Visual trend direction for the change indicator.
   */
  trend?: MetricsCardTrend;
};

type MetricsCardChartSeries = {
  /**
   * Data key from `chartData` to plot in the chart.
   */
  dataKey: string;

  /**
   * Label used in legends and tooltips.
   */
  label: string;

  /**
   * Blade chart color token used for the series.
   */
  color: ChartsCategoricalColorToken | ChartSequentialColorToken;

  /**
   * Stroke style used for line rendering.
   * @default 'solid'
   */
  strokeStyle?: 'dotted' | 'dashed' | 'solid';

  /**
   * Controls whether this series appears in the footer legend.
   * @default true
   */
  showInLegend?: boolean;
};

type MetricsCardMetric = {
  /**
   * Unique identifier for the metric.
   */
  id: string;

  /**
   * Display label for the metric card.
   */
  label: string;

  /**
   * Primary metric value.
   */
  value: React.ReactNode;

  /**
   * Accessible text alternative when `value` is not a plain string.
   */
  accessibilityValue?: string;

  /**
   * Optional change summary shown alongside the metric value.
   */
  change?: MetricsCardMetricChange;

  /**
   * Compact chart data shown in the collapsed card state.
   */
  sparklineData?: number[];

  /**
   * Series configuration used in the expanded comparison chart.
   */
  chartSeries: MetricsCardChartSeries[];

  /**
   * Callback invoked when the metric-specific edit action is clicked.
   */
  onEditClick?: () => void;

  /**
   * Accessibility label for the metric-specific edit action.
   */
  editLabel?: string;
};

type MetricsCardReplaceOption = {
  /**
   * Unique identifier for the replace option.
   */
  id: string;

  /**
   * Label shown in the replace menu.
   */
  label: string;

  /**
   * Optional supporting text shown in the replace menu.
   */
  description?: string;
};

type MetricsCardSeeMoreAction = {
  /**
   * Action label shown in the footer.
   */
  text: string;

  /**
   * Link destination for the footer action.
   */
  href?: string;

  /**
   * Link target for the footer action.
   */
  target?: string;

  /**
   * Callback invoked when the footer action is clicked.
   */
  onClick?: (event: React.SyntheticEvent) => void;
};

type MetricsCardLegendItem = {
  /**
   * Legend label.
   */
  label: string;

  /**
   * Blade chart color token used for the legend swatch.
   */
  color: ChartsCategoricalColorToken | ChartSequentialColorToken;
};

type MetricsCardFooter = {
  /**
   * Controls visibility of the footer section.
   * @default true
   */
  isVisible?: boolean;

  /**
   * Custom legend items to show in the footer. If omitted, legends are derived from the selected metric chart series.
   */
  legends?: MetricsCardLegendItem[];

  /**
   * Optional footer action shown alongside legends.
   */
  action?: MetricsCardSeeMoreAction;
};

type MetricsCardProps = {
  /**
   * Metric cards shown in the summary row.
   */
  metrics: MetricsCardMetric[];

  /**
   * Chart data used by the expanded comparison chart.
   */
  chartData: Array<Record<string, string | number | null>>;

  /**
   * Data key used for the chart x-axis.
   */
  xAxisDataKey: string;

  /**
   * Controlled selected metric id.
   */
  selectedMetricId?: string;

  /**
   * Initial selected metric id for uncontrolled usage.
   * @default metrics[0]?.id
   */
  defaultSelectedMetricId?: string;

  /**
   * Callback invoked when the selected metric changes.
   */
  onSelectedMetricChange?: (metricId: string) => void;

  /**
   * Enables the expandable layout with the larger comparison chart.
   * @default true
   */
  isExpandable?: boolean;

  /**
   * Controlled expanded state.
   */
  isExpanded?: boolean;

  /**
   * Initial expanded state for uncontrolled usage.
   * @default true
   */
  defaultIsExpanded?: boolean;

  /**
   * Callback invoked when the expanded state changes.
   */
  onExpandedChange?: (isExpanded: boolean) => void;

  /**
   * List of metrics available in the replace menu for the selected card.
   */
  replaceableMetrics?: MetricsCardReplaceOption[];

  /**
   * Callback invoked when a selected metric is replaced from the replace menu.
   */
  onReplaceMetric?: (args: { currentMetricId: string; nextMetricId: string }) => void;

  /**
   * Optional footer content shown below the expanded chart.
   */
  footer?: MetricsCardFooter;

  /**
   * Chart type used in the expanded comparison chart.
   * @default 'line'
   */
  expandedChartType?: MetricsCardChartType;

  /**
   * Chart type used in the collapsed sparkline.
   * @default 'line'
   */
  collapsedChartType?: MetricsCardChartType;

  /**
   * Formatter used for y-axis tick labels in the expanded chart.
   * @default (value) => value
   */
  yAxisTickFormatter?: (value: string) => string;

  /**
   * Width of the root card container.
   * @default '100%'
   */
  width?: BoxProps['width'];

  /**
   * Minimum width of the root card container.
   */
  minWidth?: BoxProps['minWidth'];

  /**
   * Maximum width of the root card container.
   */
  maxWidth?: BoxProps['maxWidth'];
} & TestID &
  DataAnalyticsAttribute;

export type {
  MetricsCardProps,
  MetricsCardMetric,
  MetricsCardReplaceOption,
  MetricsCardMetricChange,
  MetricsCardChartSeries,
  MetricsCardChartType,
  MetricsCardSeeMoreAction,
  MetricsCardLegendItem,
  MetricsCardFooter,
  MetricsCardTrend,
};
