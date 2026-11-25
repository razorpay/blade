import React from 'react';
import type {
  ChartGridlineWidth,
  ChartLegendGap,
  ChartLegendPlacement,
  ChartResolvedYLabelPlacement,
  ChartVersion,
  ChartWrapperDisplayProps,
} from './types';
import { V2_CHART_MARGIN, componentId } from './tokens';
import { logger } from '~utils/logger';
import { getComponentId } from '~utils/isValidAllowedChildren';

type ChartDisplayOptions = {
  chartVersion: ChartVersion;
  showBorder: boolean;
  /** True for a bar chart with `layout="vertical"`: its Y axis holds category names. */
  isVerticalBar: boolean;
  yLabelPlacement: ChartResolvedYLabelPlacement;
  yGridlines: boolean;
  /** Undefined keeps recharts' 1px stroke, as before. */
  gridlineWidth?: ChartGridlineWidth;
  legendPlacement?: ChartLegendPlacement;
  /** `v2`: the legend gap token. Undefined with `v1`. */
  legendGap?: ChartLegendGap;
};

type DisplayOptionProps = Omit<ChartWrapperDisplayProps, 'valueFormat' | 'version'>;

/** The display options. They apply with `version="v2"` only. */
const DISPLAY_OPTION_NAMES: ReadonlyArray<keyof DisplayOptionProps> = [
  'showBorder',
  'yLabelPlacement',
  'yGridlines',
  'gridlineWidth',
  'legendPlacement',
  'showLegend',
  'legendGap',
];

/**
 * Resolves the display props of a chart wrapper.
 * - `v1`: the chart as on Blade master. The display props have no effect.
 * - `v2`: no border, `left` Y labels and `thinner` gridlines by default. An explicit prop wins.
 *   `overlap` with `showBorder` resolves to `left`: the border would run under the labels.
 *
 * `isVerticalBar`: a bar chart with its categories on the Y axis always takes `left`, so its
 * category names sit in a column next to their bars.
 */
const resolveChartDisplayOptions = (
  {
    version = 'v1',
    showBorder = false,
    yLabelPlacement,
    yGridlines,
    gridlineWidth,
    legendPlacement,
    legendGap,
  }: DisplayOptionProps & { version?: ChartVersion },
  { isVerticalBar = false }: { isVerticalBar?: boolean } = {},
): ChartDisplayOptions => {
  if (version === 'v1') {
    return {
      chartVersion: 'v1',
      showBorder: false,
      isVerticalBar,
      yLabelPlacement: 'left',
      yGridlines: true,
    };
  }

  const resolvePlacement = (): ChartResolvedYLabelPlacement => {
    if (isVerticalBar) return 'left';
    if (yLabelPlacement === 'overlap' && showBorder) return 'left';
    return yLabelPlacement ?? 'left';
  };

  return {
    chartVersion: 'v2',
    showBorder,
    isVerticalBar,
    yLabelPlacement: resolvePlacement(),
    yGridlines: yGridlines ?? true,
    gridlineWidth: gridlineWidth ?? 'thinner',
    legendPlacement,
    legendGap: legendGap ?? 'spacing.5',
  };
};

/** The number of direct children, arrays flattened, with this Blade component id. */
const countChildrenOf = (children: React.ReactNode, id: string): number =>
  React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && getComponentId(child) === id,
  ).length;

/** True when a direct child, arrays flattened, is a ChartLegend. */
const hasLegendChild = (children: React.ReactNode): boolean =>
  countChildrenOf(children, componentId.chartLegend) > 0;

type LegendRuleInput = {
  version?: ChartVersion;
  showLegend?: boolean;
  /** The series of the chart, or the slices of a donut. */
  seriesCount: number;
  children: React.ReactNode;
};

/**
 * `v2`: whether the legend shows. The rule lives on the wrapper, because only the wrapper knows
 * the series and the children.
 * - `showLegend` true or false wins.
 * - Unset (auto): a ChartLegend child shows, even for one series. With no ChartLegend child, the
 *   legend shows for 2 or more series (or donut slices) and hides for one.
 *
 * `v1`: undefined, so ChartLegend renders as on master.
 */
const resolveLegendVisibility = ({
  version = 'v1',
  showLegend,
  seriesCount,
  children,
}: LegendRuleInput): boolean | undefined => {
  if (version !== 'v2') return undefined;
  if (showLegend !== undefined) return showLegend;
  return hasLegendChild(children) || seriesCount > 1;
};

/**
 * `v2` with no ChartLegend child: the wrapper adds one when the legend shows. That is
 * `showLegend` true, or auto with 2 or more series.
 */
const shouldAddLegend = (input: LegendRuleInput): boolean =>
  input.version === 'v2' &&
  !hasLegendChild(input.children) &&
  resolveLegendVisibility(input) === true;

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
 * margin, so the plot height is the same with and without a border. The legend, the label column
 * and the X labels sit inside the chart box.
 */
const getChartMargin = ({
  chartVersion,
}: Pick<ChartDisplayOptions, 'chartVersion'>): typeof V2_CHART_MARGIN | undefined =>
  chartVersion === 'v2' ? V2_CHART_MARGIN : undefined;

export {
  resolveChartDisplayOptions,
  getChartMargin,
  useWarnDisplayPropsOnV1,
  countChildrenOf,
  resolveLegendVisibility,
  shouldAddLegend,
};
export type { ChartDisplayOptions };
