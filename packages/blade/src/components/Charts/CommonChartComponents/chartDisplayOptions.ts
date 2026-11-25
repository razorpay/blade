import React from 'react';
import type {
  ChartAxisStyle,
  ChartGridlineWidth,
  ChartLegendPlacement,
  ChartResolvedYLabelPlacement,
  ChartVersion,
  ChartWrapperDisplayProps,
} from './types';
import { V2_CHART_MARGIN } from './tokens';
import { logger } from '~utils/logger';

type ChartDisplayOptions = {
  chartVersion: ChartVersion;
  axisStyle: ChartAxisStyle;
  yAxisLine: boolean;
  yLabelPlacement: ChartResolvedYLabelPlacement;
  yGridlines: boolean;
  /** Undefined keeps recharts' 1px stroke, as before. */
  gridlineWidth?: ChartGridlineWidth;
  legendPlacement?: ChartLegendPlacement;
};

type DisplayOptionProps = Omit<ChartWrapperDisplayProps, 'valueFormat' | 'version'>;

/** The display options. They apply with `version="v2"` only. */
const DISPLAY_OPTION_NAMES: ReadonlyArray<keyof DisplayOptionProps> = [
  'axisStyle',
  'yAxisLine',
  'yLabelPlacement',
  'yGridlines',
  'gridlineWidth',
  'legendPlacement',
];

/**
 * Resolves the display props of a chart wrapper.
 * - `v1`: the chart as on Blade master. The display props have no effect.
 * - `v2`: `axisStyle` sets the defaults, and an explicit prop wins. The Y labels sit in a `left`
 *   column by default, in every `axisStyle`.
 *
 * `isVerticalBar`: a bar chart with its categories on the Y axis keeps `lines` and always takes
 * `left`, so its category names sit in a column next to their bars.
 */
const resolveChartDisplayOptions = (
  {
    version = 'v1',
    axisStyle: axisStyleProp = 'lines',
    yAxisLine,
    yLabelPlacement,
    yGridlines,
    gridlineWidth,
    legendPlacement,
  }: DisplayOptionProps & { version?: ChartVersion },
  { isVerticalBar = false }: { isVerticalBar?: boolean } = {},
): ChartDisplayOptions => {
  if (version === 'v1') {
    return {
      chartVersion: 'v1',
      axisStyle: 'lines',
      yAxisLine: true,
      yLabelPlacement: 'left',
      yGridlines: true,
    };
  }
  const axisStyle = isVerticalBar ? 'lines' : axisStyleProp;
  const isMinimal = axisStyle === 'minimal';

  const resolvePlacement = (): ChartResolvedYLabelPlacement => {
    if (isVerticalBar) return 'left';
    if (yLabelPlacement === 'outside') return 'right';
    return yLabelPlacement ?? 'left';
  };

  return {
    chartVersion: 'v2',
    axisStyle,
    yAxisLine: yAxisLine ?? !isMinimal,
    yLabelPlacement: resolvePlacement(),
    yGridlines: yGridlines ?? true,
    gridlineWidth: gridlineWidth ?? (isMinimal ? 'thinner' : undefined),
    legendPlacement,
  };
};

/**
 * Development only: warns when a display prop is set on a `v1` chart, where it has no effect.
 */
const useWarnDisplayPropsOnV1 = (
  version: ChartVersion | undefined,
  props: Partial<DisplayOptionProps>,
  moduleName: string,
): void => {
  const setNames = DISPLAY_OPTION_NAMES.filter((name) => props[name] !== undefined).join(', ');
  React.useEffect(() => {
    if ((version ?? 'v1') !== 'v1' || !setNames) return;
    logger({
      type: 'warn',
      moduleName,
      message: `${setNames} has no effect with version="v1". Set version="v2" to use it.`,
    });
  }, [version, setNames, moduleName]);
};

/**
 * The recharts margin of a chart. Undefined for `v1`: recharts' default, as on master. `v2`: no
 * margin, so the plot height is the same in every `axisStyle`. The legend, the label column and
 * the X labels sit inside the chart box.
 */
const getChartMargin = ({
  chartVersion,
}: Pick<ChartDisplayOptions, 'chartVersion'>): typeof V2_CHART_MARGIN | undefined =>
  chartVersion === 'v2' ? V2_CHART_MARGIN : undefined;

export { resolveChartDisplayOptions, getChartMargin, useWarnDisplayPropsOnV1 };
export type { ChartDisplayOptions };
