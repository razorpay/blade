import type {
  ChartAxisStyle,
  ChartGridlineWidth,
  ChartLabelSize,
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
  labelSize?: ChartLabelSize;
};

/**
 * Resolves the display props of a chart wrapper. `axisStyle` sets the defaults, and an explicit
 * prop wins. `isVerticalBar`: a bar chart with its categories on the Y axis keeps `lines` and the
 * classic Y gutter.
 */
const resolveChartDisplayOptions = (
  {
    axisStyle: axisStyleProp = 'lines',
    yAxisLine,
    yLabelPlacement,
    yGridlines,
    gridlineWidth,
    legendPlacement,
    labelSize,
  }: Omit<ChartWrapperDisplayProps, 'valueFormat'>,
  { isVerticalBar = false }: { isVerticalBar?: boolean } = {},
): ChartDisplayOptions => {
  const axisStyle = isVerticalBar ? 'lines' : axisStyleProp;
  const isMinimal = axisStyle === 'minimal';

  const resolvePlacement = (): ChartResolvedYLabelPlacement => {
    if (isVerticalBar) return 'legacy';
    if (yLabelPlacement === 'outside') return 'right';
    if (yLabelPlacement) return yLabelPlacement;
    return isMinimal ? 'overlap' : 'legacy';
  };

  return {
    axisStyle,
    yAxisLine: yAxisLine ?? !isMinimal,
    yLabelPlacement: resolvePlacement(),
    yGridlines: yGridlines ?? true,
    gridlineWidth: gridlineWidth ?? (isMinimal ? 'thinner' : undefined),
    legendPlacement,
    labelSize,
  };
};

/** True when the chart needs the ChartSurface CSS. False keeps the plain wrapper of before. */
const needsChartSurface = ({
  axisStyle,
  yLabelPlacement,
}: Pick<ChartDisplayOptions, 'axisStyle' | 'yLabelPlacement'>): boolean =>
  !(axisStyle === 'lines' && yLabelPlacement === 'legacy');

type ChartMargin = { top: number; right: number; bottom: number; left: number };

/**
 * The recharts margin of a chart. Undefined for a `lines` chart with the classic gutter, so it
 * renders as before. A `left` or `right` label column sets its side to 0: the widest label then
 * meets the edge of the chart.
 */
const getChartMargin = ({
  axisStyle,
  yLabelPlacement,
}: Pick<ChartDisplayOptions, 'axisStyle' | 'yLabelPlacement'>): ChartMargin | undefined => {
  if (!needsChartSurface({ axisStyle, yLabelPlacement })) return undefined;
  const base = axisStyle === 'minimal' ? MINIMAL_AXIS_CHART_MARGIN : DEFAULT_CHART_MARGIN;
  return {
    ...base,
    ...(yLabelPlacement === 'left' ? { left: 0 } : {}),
    ...(yLabelPlacement === 'right' ? { right: 0 } : {}),
  };
};

export { resolveChartDisplayOptions, getChartMargin, needsChartSurface };
export type { ChartDisplayOptions, ChartMargin };
