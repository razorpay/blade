import type {
  ChartAxisStyle,
  ChartGridlineWidth,
  ChartLegendPlacement,
  ChartResolvedYLabelPlacement,
  ChartWrapperDisplayProps,
} from './types';
import { DEFAULT_CHART_MARGIN, MINIMAL_AXIS_CHART_MARGIN } from './tokens';

type ChartDisplayOptions = {
  axisStyle: ChartAxisStyle;
  yAxisLine: boolean;
  yLabelPlacement: ChartResolvedYLabelPlacement;
  yGridlines: boolean;
  /** Undefined keeps recharts' 1px stroke, as before. */
  gridlineWidth?: ChartGridlineWidth;
  legendPlacement?: ChartLegendPlacement;
};

/**
 * Resolves the display props of a chart wrapper. `axisStyle` sets the defaults, and an explicit
 * prop wins. The Y labels sit in a `left` column by default, in every `axisStyle`.
 * `isVerticalBar`: a bar chart with its categories on the Y axis keeps `lines` and always takes
 * `left`, so its category names sit in a column next to their bars.
 */
const resolveChartDisplayOptions = (
  {
    axisStyle: axisStyleProp = 'lines',
    yAxisLine,
    yLabelPlacement,
    yGridlines,
    gridlineWidth,
    legendPlacement,
  }: Omit<ChartWrapperDisplayProps, 'valueFormat'>,
  { isVerticalBar = false }: { isVerticalBar?: boolean } = {},
): ChartDisplayOptions => {
  const axisStyle = isVerticalBar ? 'lines' : axisStyleProp;
  const isMinimal = axisStyle === 'minimal';

  const resolvePlacement = (): ChartResolvedYLabelPlacement => {
    if (isVerticalBar) return 'left';
    if (yLabelPlacement === 'outside') return 'right';
    return yLabelPlacement ?? 'left';
  };

  return {
    axisStyle,
    yAxisLine: yAxisLine ?? !isMinimal,
    yLabelPlacement: resolvePlacement(),
    yGridlines: yGridlines ?? true,
    gridlineWidth: gridlineWidth ?? (isMinimal ? 'thinner' : undefined),
    legendPlacement,
  };
};

type ChartMargin = { top: number; right: number; bottom: number; left: number };

/**
 * The recharts margin of a chart. A `left` or `right` label column sets its side to 0: the widest
 * label then meets the edge of the chart.
 */
const getChartMargin = ({
  axisStyle,
  yLabelPlacement,
}: Pick<ChartDisplayOptions, 'axisStyle' | 'yLabelPlacement'>): ChartMargin => {
  const base = axisStyle === 'minimal' ? MINIMAL_AXIS_CHART_MARGIN : DEFAULT_CHART_MARGIN;
  return {
    ...base,
    ...(yLabelPlacement === 'left' ? { left: 0 } : {}),
    ...(yLabelPlacement === 'right' ? { right: 0 } : {}),
  };
};

export { resolveChartDisplayOptions, getChartMargin };
export type { ChartDisplayOptions, ChartMargin };
