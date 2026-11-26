import React from 'react';
import { useActiveTooltipDataPoints, useIsTooltipActive } from 'recharts';
import type { ChartActivePoint, DataColorMapping } from './types';
import type { ActivePointSeries } from './activePoint';
import { createActivePointBuilder, useActivePointChange } from './activePoint';
import { useCommonChartComponentsContext } from './CommonChartComponentsContext';
import { getChartColor } from './CommonChartComponents.web';
import { getComponentId } from '~utils/isValidAllowedChildren';
import getIn from '~utils/lodashButBetter/get';
import type { Theme } from '~components/BladeProvider';
import { useTheme } from '~components/BladeProvider';

/**
 * The series of a line, area or bar chart for its active point: each series child that shows, in
 * the colour of its legend swatch.
 */
const getActivePointSeries = ({
  children,
  seriesComponentId,
  dataColorMapping,
  chartName,
  selectedDataKeys,
  theme,
}: {
  children: React.ReactNode;
  seriesComponentId: string;
  dataColorMapping: DataColorMapping;
  chartName: 'line' | 'area' | 'bar';
  selectedDataKeys?: string[];
  theme: Theme;
}): ActivePointSeries[] =>
  React.Children.toArray(children)
    .filter(
      (child): child is React.ReactElement<{ dataKey?: unknown; name?: unknown }> =>
        React.isValidElement(child) && getComponentId(child) === seriesComponentId,
    )
    .map((child) => {
      const dataKey = String(child.props.dataKey);
      const name = typeof child.props.name === 'string' ? child.props.name : dataKey;
      const colorToken = getChartColor(dataKey, name, dataColorMapping, chartName);
      const color = getIn(theme.colors, colorToken) as string;
      return { dataKey, name, color, colorToken };
    })
    .filter((series) => !selectedDataKeys || selectedDataKeys.includes(series.dataKey));

/** The active index of the chart, from its tooltip state: mouse, touch and keyboard set it. */
const useActiveIndex = (data: ReadonlyArray<unknown>): number | undefined => {
  const isActive = useIsTooltipActive();
  const points = useActiveTooltipDataPoints();
  const point = isActive ? points?.[0] : undefined;
  if (point === undefined) return undefined;
  // recharts gives the data row itself. A pie gives its sector, which holds the row in `payload`.
  const direct = data.indexOf(point);
  if (direct >= 0) return direct;
  const payload = (point as { payload?: unknown } | null)?.payload;
  const fromPayload = payload === undefined ? -1 : data.indexOf(payload);
  return fromPayload >= 0 ? fromPayload : undefined;
};

/**
 * Renders nothing. Inside a line, area or bar chart, it reports the active point. A wrapper
 * renders it only when `onActivePointChange` is set, so a chart with no callback renders as
 * before.
 */
const ChartActivePointReporter = ({
  data,
  children,
  seriesComponentId,
  chartName,
  labelAxisId,
  onActivePointChange,
}: {
  data: ReadonlyArray<Record<string, unknown>>;
  children: React.ReactNode;
  seriesComponentId: string;
  chartName: 'line' | 'area' | 'bar';
  labelAxisId?: string;
  onActivePointChange: (point: ChartActivePoint | null) => void;
}): null => {
  const { theme } = useTheme();
  const { dataColorMapping, selectedDataKeys, valueFormat } = useCommonChartComponentsContext();
  const buildPoint = createActivePointBuilder({
    data,
    children,
    valueFormat,
    labelAxisId,
    series: getActivePointSeries({
      children,
      seriesComponentId,
      dataColorMapping: dataColorMapping ?? {},
      chartName,
      selectedDataKeys,
      theme,
    }),
  });
  useActivePointChange(useActiveIndex(data), buildPoint, onActivePointChange);
  return null;
};

export { ChartActivePointReporter, useActiveIndex };
