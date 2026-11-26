import React from 'react';
import type {
  ChartCartesianGridProps,
  ChartDonutLegendPlacement,
  ChartGridlineWidth,
  ChartLegendGap,
  ChartLegendProps,
  ChartResolvedYLabelPlacement,
  ChartVersion,
  ChartYAxisProps,
  ChartYLabelPlacement,
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
  legendPlacement?: ChartDonutLegendPlacement;
  /** `v2`: the legend gap token. Undefined with `v1`. */
  legendGap?: ChartLegendGap;
};

/**
 * The display options as the children of a chart wrapper set them: `ChartCartesianGrid`
 * (`horizontal`, `lineWidth`, `showBorder`), the first `ChartYAxis` (`labelPlacement`) and
 * `ChartLegend` (`placement`, `gap`).
 */
type ChartChildDisplayProps = {
  showBorder?: boolean;
  /** False when ChartCartesianGrid has `horizontal={false}`. */
  yGridlines?: boolean;
  gridlineWidth?: ChartGridlineWidth;
  yLabelPlacement?: ChartYLabelPlacement;
  legendPlacement?: ChartDonutLegendPlacement;
  legendGap?: ChartLegendGap;
};

/** The props of the first direct child, arrays flattened, with this Blade component id. */
const findChildProps = <Props>(children: React.ReactNode, id: string): Props | undefined => {
  const child = React.Children.toArray(children).find(
    (node) => React.isValidElement(node) && getComponentId(node) === id,
  );
  return React.isValidElement(child) ? (child.props as Props) : undefined;
};

/** The number of direct children, arrays flattened, with this Blade component id. */
const countChildrenOf = (children: React.ReactNode, id: string): number =>
  React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && getComponentId(child) === id,
  ).length;

/**
 * Reads the display options from the children of a chart wrapper. The wrapper puts them in the
 * context, so the layout of the plot, the legend and the label column reads them in one place.
 */
const readChildDisplayProps = (children: React.ReactNode): ChartChildDisplayProps => {
  const grid = findChildProps<ChartCartesianGridProps>(children, componentId.chartCartesianGrid);
  const yAxis = findChildProps<ChartYAxisProps>(children, componentId.chartYAxis);
  const legend = findChildProps<ChartLegendProps>(children, componentId.chartLegend);
  return {
    showBorder: grid?.showBorder,
    yGridlines: grid?.horizontal === false ? false : undefined,
    gridlineWidth: grid?.lineWidth,
    yLabelPlacement: yAxis?.labelPlacement,
    legendPlacement: legend?.placement,
    legendGap: legend?.gap,
  };
};

/**
 * `v2`: where the Y labels sit. `overlap` with a border is `left`: the border would run under the
 * labels. A bar chart with its categories on the Y axis always takes `left`, so its category
 * names sit in a column next to their bars.
 */
const resolveYLabelPlacement = (
  yLabelPlacement: ChartYLabelPlacement | undefined,
  { showBorder = false, isVerticalBar = false }: { showBorder?: boolean; isVerticalBar?: boolean },
): ChartResolvedYLabelPlacement => {
  if (isVerticalBar) return 'left';
  if (yLabelPlacement === 'overlap' && showBorder) return 'left';
  return yLabelPlacement ?? 'left';
};

/**
 * Resolves the display options of a chart, as its children set them.
 * - `v1`: the chart as on Blade master. The display options have no effect.
 * - `v2`: no border, `left` Y labels and `thinner` gridlines by default. An explicit prop wins.
 *   `overlap` with a border resolves to `left`.
 *
 * `isVerticalBar`: a bar chart with its categories on the Y axis always takes `left`.
 * `isDonut`: only a donut takes a `left` or `right` legend. Other charts show it at the bottom.
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
  }: ChartChildDisplayProps & { version?: ChartVersion },
  { isVerticalBar = false, isDonut = false }: { isVerticalBar?: boolean; isDonut?: boolean } = {},
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

  const isSidePlacement = legendPlacement === 'left' || legendPlacement === 'right';

  return {
    chartVersion: 'v2',
    showBorder,
    isVerticalBar,
    yLabelPlacement: resolveYLabelPlacement(yLabelPlacement, { showBorder, isVerticalBar }),
    yGridlines: yGridlines ?? true,
    gridlineWidth: gridlineWidth ?? 'thinner',
    legendPlacement: isSidePlacement && !isDonut ? undefined : legendPlacement,
    legendGap: legendGap ?? 'spacing.5',
  };
};

/** The display props of each child, by component, for the development warnings. */
const DISPLAY_CHILD_PROPS: ReadonlyArray<{
  id: string;
  name: string;
  props: ReadonlyArray<string>;
}> = [
  {
    id: componentId.chartCartesianGrid,
    name: 'ChartCartesianGrid',
    props: ['lineWidth', 'showBorder'],
  },
  { id: componentId.chartYAxis, name: 'ChartYAxis', props: ['labelPlacement'] },
  { id: componentId.chartLegend, name: 'ChartLegend', props: ['placement', 'gap'] },
];

/** The display props set on the direct children, as `ChartLegend placement`. */
const getSetChildDisplayProps = (children: React.ReactNode): string[] => {
  const childArray = React.Children.toArray(children);
  return DISPLAY_CHILD_PROPS.flatMap(({ id, name, props }) => {
    const setProps = new Set<string>();
    childArray.forEach((child) => {
      if (!React.isValidElement(child) || getComponentId(child) !== id) return;
      const childProps = child.props as Record<string, unknown>;
      props.forEach((prop) => {
        if (childProps[prop] !== undefined) setProps.add(prop);
      });
    });
    return Array.from(setProps, (prop) => `${name} ${prop}`);
  });
};

/**
 * Development only: warns when a display prop is set on a child of a `v1` chart, where it has no
 * effect.
 */
const useWarnDisplayPropsOnV1 = (
  version: ChartVersion | undefined,
  children: React.ReactNode,
  moduleName: string,
): void => {
  const setNames = getSetChildDisplayProps(children).join(', ');
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
 * Development only, native: warns when a prop that works on web only is set. The native charts
 * ignore `version="v2"`, `valueFormat` and the display props of the children.
 */
const useWarnWebOnlyChartProps = (
  {
    version,
    hasValueFormat,
    children,
  }: { version?: ChartVersion; hasValueFormat: boolean; children: React.ReactNode },
  moduleName: string,
): void => {
  const setNames = [
    ...(version === 'v2' ? ['version="v2"'] : []),
    ...(hasValueFormat ? ['valueFormat'] : []),
    ...getSetChildDisplayProps(children),
  ].join(', ');
  React.useEffect(() => {
    if (!setNames) return;
    logger({
      type: 'warn',
      moduleName,
      message: `${setNames} works on web only. The native chart ignores it.`,
    });
  }, [setNames, moduleName]);
};

/**
 * Development only: warns when a Blade display prop and the recharts prop it sets are both set on
 * one component. The Blade prop wins.
 */
const useWarnOverriddenRechartsProps = (
  isActive: boolean,
  pairs: ReadonlyArray<{ bladeProp: string; rechartsProp: string; isBothSet: boolean }>,
  moduleName: string,
): void => {
  const message = isActive
    ? pairs
        .filter(({ isBothSet }) => isBothSet)
        .map(
          ({ bladeProp, rechartsProp }) =>
            `${bladeProp} and ${rechartsProp} are both set. ${bladeProp} wins, and ${rechartsProp} is ignored.`,
        )
        .join(' ')
    : '';
  React.useEffect(() => {
    if (!message) return;
    logger({ type: 'warn', moduleName, message });
  }, [message, moduleName]);
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
  resolveYLabelPlacement,
  readChildDisplayProps,
  getChartMargin,
  useWarnDisplayPropsOnV1,
  useWarnWebOnlyChartProps,
  useWarnOverriddenRechartsProps,
  countChildrenOf,
};
export type { ChartDisplayOptions, ChartChildDisplayProps };
